import { Elysia, t } from 'elysia';
import Human from '@vladmandic/human';

const human = new Human({
    debug: false,
    async: false,
    filter: {
        enabled: false,
        flip: false,
    },
    face: {
        enabled: true,
        detector: {
            enabled: false,
        },
        liveness: {
            enabled: true,
        },
        antispoof: {
            enabled: false,
        }, 
        attention: {
            enabled: false,
        },
        description: {
            enabled: false,
        },
        emotion: {
            enabled: false,
        },
        gear: {
            enabled: false,
        },
        iris: {
            enabled: false,
        },
        mesh: {
            enabled: false,
        },
    },
     hand: {
        enabled: false,
    },
    body: { enabled: false },
    object: { enabled: false },
    deallocate: true,
    gesture: { enabled: false },
});

// Initialize Human library
await human.tf.ready();
console.log('Human version:', human.version, 'TensorFlow:', human.tf.version_core);
await human.load();
console.log('Human library loaded successfully');

const app = new Elysia()
    .get('/', () => ({
        message: 'Face Liveness Detection API',
        endpoints: {
            'POST /detect-liveness': 'Upload an image to detect liveness'
        }
    }))
    .post('/detect-liveness', async ({ body }) => {
        try {
            if (!body.image) {
                return {
                    success: false,
                    error: 'No image provided'
                };
            }

            // Convert File to buffer
            const buffer = Buffer.from(await body.image.arrayBuffer());

            // Process image
            const tensor = human.tf.tidy(() => {
                const decode = human.tf.node.decodeImage(buffer, 3);
                let expand;
                if (decode.shape[2] === 4) {
                    const channels = human.tf.split(decode, 4, 2);
                    const rgb = human.tf.stack([channels[0], channels[1], channels[2]], 2);
                    expand = human.tf.reshape(rgb, [1, decode.shape[0], decode.shape[1], 3]);
                } else {
                    expand = human.tf.expandDims(decode, 0);
                }
                const cast = human.tf.cast(expand, 'float32');
                return cast;
            });

            // Detect faces
            const result = await human.detect(tensor);
            
            const liveCount = result.face.filter((face) => face.live && face.live === 1).length;
            const totalFaces = result.face.length;

            // Clean up
            human.tf.dispose(tensor);

            const faces = result.face.map((face) => ({
                live: face.live,
            }));

            return {
                success: true,
                totalFaces,
                memory: process.memoryUsage().rss,
                liveCount,
                isOneLiveOrLess: liveCount === 1,
                faces: faces,
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }, {
        body: t.Object({
            image: t.File({
                type: ['image/*'],
            })
        })
    })
    .listen({
        port: Bun.env.PORT || 3000,
        hostname: '127.0.0.1',
    });

console.log(`🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`);