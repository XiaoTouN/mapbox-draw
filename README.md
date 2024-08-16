# mapbox-draw
### A plugin for drawing graphics on mapbox

This plugin is only used for the Mapbox framework. It adds the functions of drawing lines, rectangles, and circles to other drawing plugins. You can decide what to do with the drawing result through the callback (function) configuration item. At the same time, for the drawn graphics, the plugin will provide a default style. If you need to customize the style of the drawn graphics, you can customize it through the configuration item.

```
interface MapboxDrawOptions {
  autoStop?: boolean;
  pointPaint?: Object;
  pointLayout?: Object;
  linePaint?: Object;
  lineLayout?: Object;
  polygonPaint?: Object;
  polygonLayout?: Object;
  circlePaint?: Object;
  circleLayout?: Object;
  callback?: (e: any) => void;
}

type drawModelType = 'point' | 'line' | 'lineString' | 'polygon' | 'rectangle' | 'circle'

const draw = new mapboxDraw({} as MapboxDrawOptions)

draw.changeMode('point' as drawModelType)
```
![358647492-38b5fa07-a609-4963-8eb9-f394f5f1b2ac](https://github.com/user-attachments/assets/3491f962-d1f6-46ff-9738-4b59cb216790)
