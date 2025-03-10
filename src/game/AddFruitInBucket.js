import { World, Bodies} from 'matter-js'
import { BUCKET_CATEGORY, BUCKET_HEIGHT, FRUIT_CATEGORY } from './constants'
const AddFruitInBucket = (world,position,currentFruit,scale) => {
    const fruitRadius = currentFruit * 10;
    const fruit = Bodies.circle(
        position.x,
        window.innerHeight - BUCKET_HEIGHT - 50,
        fruitRadius,{
            restitution: 0.2,
            friction: 1,
            density: 1,
            label: 'fruit',
            render: {
                sprite:{
                    texture: `./fruits/${currentFruit}.png`,
                    xScale:scale,
                    yScale:scale
                }
            },
            collisionFilter:{
                category:FRUIT_CATEGORY,
                mask:FRUIT_CATEGORY | BUCKET_CATEGORY
            }
        }
    );
    World.add(world,fruit)
}
export default AddFruitInBucket;