import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import pixel from "@/components/pixelClass";
import redImage from "@/public/17686.png";

export default function Home() {
  const router = useRouter();
  const canvasObj = useRef(null);
  const [reload, setReload] = useState(false);
  useEffect(onLoad, [reload]);

  function onLoad() {
    const context = canvasObj.current.getContext('2d');
    const size = 3; // размер частицы БЛ А КАК  я заскриню) ЕБАТЬ ТАМ ОДНА КУЧА НА ДРУГУЮ НАПАДАЕТ
    let pixels = []; // массив всех пикселей на холсте
    let imageData = context.getImageData(0, 0, 1920, 1080); // это пока похуй, не используется, можно удалить

    const drawPixel = (x, y, c) => {
      // функция для отрисовки пикселя
      context.fillStyle = c;
      context.fillRect(x, y, size, size);
    };

    const getPixelObj = (x, y, c, speed) => {
      // функция для создания пикселя
      return {
        x: x,
        y: y,
        c: c,
        speed: speed,
        vx: 0,
        vy: 0
      };
    };

    const addPixels = (count, color, speed) => {
      // функция для создания группы пикселей
      let group = [];
      for (let i = 0; i < count; i++) {
        group.push(getPixelObj(getRand(0, 500), getRand(0, 500), color, speed));
        pixels.push(group[i]);
      }
      return group;
    };

    const screenSize = [0, 0, 500, 500]; // для упрощения работы, можно удалить

    const rule = (group1, group2, g, range) => {
      for (let i = 0; i < group1.length; i++) {
        let fx = 0;
        let fy = 0;
        for (let j = 0; j < group2.length; j++) {
          let a = group1[i];
          let b = group2[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0 && d < range) {
            let F = g * (1 / d);
            fx += F * dx;
            fy += F * dy;
          }
          a.vx = (a.vx + fx) * 0.5;
          a.vy = (a.vy + fy) * 0.5;
          a.x += a.vx;
          a.y += a.vy;
          if (a.x <= 0) a.x = 499;
          if (a.y <= 0) a.y = 499;
          if (a.x >= 500) a.x = 1;
          if (a.y >= 500) a.y = 1;
        }
      }
    };

    let blue = addPixels(100, 'blue', 0);
    let red = addPixels(100, 'red', 0);
    let white = addPixels(10,'white',0);

    const update = () => {
        // эта функция вызывается каждый кадр для отрисовки и всего такого
        context.fillStyle = 'black';
        context.clearRect(...screenSize); // здесь очищаем канвас полностью для перерисовки
        context.fillRect(...screenSize); // здесь заполняем его чёрным
        // положительное число - отталкивание

        rule(blue,red,-0.5,80);
        rule(red,blue,-0.5,80);
        rule(white,white,-0.01,80);
        rule(blue,white,0.05,80);
        rule(red,white,0.05,80);

        pixels.map(({ x, y, c }) => {
          drawPixel(x, y, c);
        });
        requestAnimationFrame(update);
    };
      update();
    };

  function getRand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getPixelsArray() {
    console.log(pixels);
  }

  return (
    <>
      <canvas style={{ border: '1px solid black' }} ref={canvasObj} width={500} height={500}></canvas>
      <div style={{ position: 'absolute', top: 0 }}>
        <button onClick={() => {router.reload()}}><img width={30} src="17686.png" /></button>
      </div>
    </>
  ) 
}
