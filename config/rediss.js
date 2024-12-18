import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'HHxFawOHZ8b7BucRr80bPxPaflxcrB4a',
    socket: {
        host: 'redis-18648.c44.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 18648
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)

