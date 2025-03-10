import React, { useEffect, useRef, useState } from 'react'
import {  Render, Engine, Runner, Mouse, MouseConstraint, 
          Events, World, Bodies } from 'matter-js'
import {  BUCKET_HEIGHT , BUCKET_WIDTH , BUCKET_THICKNESS, 
          SCALE, MOUSE_CATEGORY, FRUIT_CATEGORY, BUCKET_CATEGORY
} from './constants'
import Bucket from './Bucket'
import AddFruitInBucket from './AddFruitInBucket'
import ChangeRadius from './ChangeRadius'

import './style.css'
function Main() {
  const sceneRef = useRef(null);
  const nextFruitRef = useRef(null);
  const [score,setScore] = useState(0);
  let currentFruit = Math.floor(Math.random() * 4) + 1;

  useEffect(()=>{
    const engine = Engine.create();
    const world = engine.world;
    const runner = Runner.create();
    const render = Render.create({
      element:sceneRef.current,
      engine:engine,
      options:{
        width:window.innerWidth,
        height:window.innerHeight,
        wireframes:false,
        background:'#ffe1ae'
      }
    });

    Render.run(render);
    Runner.run(runner,engine);
    const x = window.innerWidth/2;
    const y = window.innerHeight;
    const { leftWall,rightWall,base } = Bucket(world,x,y,
      BUCKET_WIDTH,BUCKET_HEIGHT,BUCKET_THICKNESS);

    nextFruitRef.current = Bodies.circle(
      window.innerWidth/2 + BUCKET_WIDTH/2 - 50,
      100,
      currentFruit*10,{
          isStatic:true,
          render: {
              sprite:{
                  texture: `./fruits/${currentFruit}.png`,
                  xScale:0.5,
                  yScale:0.5
              }
          }
    });
    World.add(world,nextFruitRef.current);
    const mouse = Mouse.create();
    const mouseConstraint = MouseConstraint.create(engine, 
      { mouse:mouse,constraint:{
        render:{visible:false}
      },
      collisionFilter:{
        category:MOUSE_CATEGORY,
        mask:FRUIT_CATEGORY
      }
    });
    World.add(world,mouseConstraint);

    Events.on(mouseConstraint,'mousedown',(event)=>{
      const position = event.mouse.position;
      const isInsideBucket =  
        position.x > leftWall.position.x + BUCKET_THICKNESS/2 &&
        position.x < rightWall.position.x - BUCKET_THICKNESS/2 && 
        position.y < base.position.y && 
        position.y > base.position.y - BUCKET_HEIGHT ;
      if(isInsideBucket){
        AddFruitInBucket(world,position,currentFruit,
        SCALE[currentFruit-1]);
        currentFruit = Math.floor(Math.random() * 4) + 1;
        nextFruitRef.current = ChangeRadius(world,
        nextFruitRef.current,currentFruit);
      }
    });
    Events.on(engine,'collisionStart',(event)=>{
      event.pairs.forEach(({bodyA,bodyB}) => {
        if( bodyA.label === 'fruit' && bodyB.label === 'fruit' &&
            bodyA.circleRadius === bodyB.circleRadius){
          World.remove(world,bodyA);
          const nextRadius = bodyB.circleRadius + 10;
          const scaleIndex = Math.floor(nextRadius/10) - 1;
          const { position } = bodyB;
          World.remove(world,bodyB);
          const newFruit = Bodies.circle(position.x,position.y,nextRadius,{
            restitution: 0.2,
            friction: 1,
            density: 1,
            label: 'fruit',
            render: {
                sprite:{
                    texture: `./fruits/${parseInt(nextRadius/10)}.png`,
                    xScale:SCALE[scaleIndex],
                    yScale:SCALE[scaleIndex]
                }
            },
            collisionFilter:{
              category:FRUIT_CATEGORY,
              mask:FRUIT_CATEGORY | BUCKET_CATEGORY
            }
          });
          World.add(world,newFruit);
          setScore(prev=>prev + 10);
        }
      });
    });
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    }
  },[]);

  
  return (
    <div className='game-container'>
      <div className='header'>
        <h2>Fruits Matching Game</h2>
        <p className='score'>Score : {score}</p>
      </div>
      <div ref={sceneRef}></div>
    </div>
  )
}

export default Main