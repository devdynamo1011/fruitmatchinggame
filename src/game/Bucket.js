import { Bodies, World } from 'matter-js'
import { BUCKET_CATEGORY, FRUIT_CATEGORY } from './constants'
const Bucket = (world,x,y,width,height,thickness) => {
    const leftWall = Bodies.rectangle(
        x - width/2 + thickness/2,
        y - height/2,
        thickness,
        height,
        {
            isStatic: true,
            render:{
                fillStyle:'#28A5BA'
            },
            collisionFilter:{
                category:BUCKET_CATEGORY,
                mask:FRUIT_CATEGORY
            }
        }
    );
    const rightWall = Bodies.rectangle(
        x + width/2 - thickness/2,
        y - height/2,
        thickness,
        height,
        {
            isStatic: true,
            render:{
                fillStyle:'#28A5BA'
            },
            collisionFilter:{
                category:BUCKET_CATEGORY,
                mask:FRUIT_CATEGORY
            }
        }
    );
    const base = Bodies.rectangle(
        x,
        y - thickness/2,
        width,
        thickness,
        {
            isStatic: true,
            render:{
                fillStyle:'#28A5BA'
            },
            collisionFilter:{
                category:BUCKET_CATEGORY,
                mask:FRUIT_CATEGORY
            }
        }
    );
    World.add(world,[leftWall,rightWall,base]);
    return {leftWall,rightWall,base};
}

export default Bucket;