var c = Object.defineProperty;
var g = (o, t, e) => t in o ? c(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var n = (o, t, e) => g(o, typeof t != "symbol" ? t + "" : t, e);
class w {
  /**
   *
   * @param {object} options
   */
  constructor(t) {
    n(this, "_boundHandleClick", this._handleClick.bind(this));
    n(this, "_boundHandleMove", this._handleMove.bind(this));
    n(this, "_boundHandleDoubleClick", this._handleDoubleClick.bind(this));
    this.autoStop = (t == null ? void 0 : t.autoStop) || !1, this.pointLayout = (t == null ? void 0 : t.pointLayout) || {}, this.pointPaint = (t == null ? void 0 : t.pointPaint) || {
      "circle-color": "#3887be",
      "circle-radius": 4,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#fff"
    }, this.lineLayout = (t == null ? void 0 : t.lineLayout) || {
      "line-join": "round",
      "line-cap": "round"
    }, this.linePaint = (t == null ? void 0 : t.linePaint) || {
      "line-color": "#3887be",
      "line-width": 4
    }, this.polygonLayout = (t == null ? void 0 : t.polygonLayout) || {}, this.polygonPaint = (t == null ? void 0 : t.polygonPaint) || {
      "fill-color": "#3887be",
      "fill-opacity": 0.5,
      "fill-outline-color": "red"
    }, this.circlePaint = (t == null ? void 0 : t.circlePaint) || {
      "circle-color": "#3887be",
      "circle-radius": [
        "interpolate",
        ["exponential", 2],
        ["zoom"],
        0,
        0,
        20,
        [
          "/",
          ["/", ["get", "radio"], 0.075],
          ["cos", ["*", ["get", "lat"], ["/", Math.PI, 180]]]
        ]
      ],
      "circle-opacity": 0.5
    }, this.circleLayout = (t == null ? void 0 : t.circleLayout) || {}, t.callback ? this.callback = t.callback : this.callback = () => {
    };
  }
  /**
   *
   * @param {mapboxgl.Map} map
   */
  addToMap(t) {
    this.map = t;
  }
  /**
   *
   * @param {'point' | 'line' | 'lineString' | 'polygon' | 'rectangle' | 'circle'} mode
   * @param {function} callback
   */
  changeMode(t) {
    if (!this.map)
      throw new Error(
        "add draw object to map (by function: addToMap) before use"
      );
    if (this.drawFeature)
      throw new Error("Can not change mode before finish drawing");
    this.mode = t, this.lastMoustStyle == null && (this.lastMoustStyle = this.map.getCanvas().style.cursor), this.map.getCanvas().style.cursor = "crosshair", this._addLayer(t), this.map.on("click", this._boundHandleClick);
  }
  _handleClick(t) {
    if (this.mode === "point") {
      const e = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [t.lngLat.lng, t.lngLat.lat]
        }
      };
      this._addFeature(e), this.callback(e), this.autoStop && this.stopDraw();
    } else if (this.mode === "line")
      this.drawFeature ? (this.drawFeature.geometry.coordinates[this.drawFeaturePointCount] = [
        t.lngLat.lng,
        t.lngLat.lat
      ], this.drawFeaturePointCount += 1, this._changeFeature(
        this.drawFeature.id,
        this.drawFeature.geometry.coordinates,
        "LineString"
      ), this.callback(this.drawFeature), this._changeFeature(
        this.drawFeature.id,
        this.drawFeature.geometry.coordinates,
        "LineString"
      ), this.map.off("mousemove", this._boundHandleMove), this.drawFeature = null, this.autoStop && this.stopDraw()) : (this.drawFeature = {
        type: "Feature",
        id: "line" + Date.now(),
        geometry: {
          type: "LineString",
          coordinates: [[t.lngLat.lng, t.lngLat.lat]]
        }
      }, this.drawFeaturePointCount = 1, this._addFeature(this.drawFeature), this.map.on("mousemove", this._boundHandleMove));
    else if (this.mode === "lineString")
      this.map.doubleClickZoom.disable(), this.drawFeature ? (this.drawFeature.geometry.coordinates[this.drawFeaturePointCount] = [
        t.lngLat.lng,
        t.lngLat.lat
      ], this.drawFeaturePointCount += 1, this._changeFeature(
        this.drawFeature.id,
        this.drawFeature.geometry.coordinates,
        "LineString"
      )) : (this.drawFeature = {
        type: "Feature",
        id: "lineString" + Date.now(),
        geometry: {
          type: "LineString",
          coordinates: [[t.lngLat.lng, t.lngLat.lat]]
        }
      }, this.drawFeaturePointCount = 1, this._addFeature(this.drawFeature), this.map.on("mousemove", this._boundHandleMove), this.map.on("dblclick", this._boundHandleDoubleClick));
    else if (this.mode === "polygon")
      this.map.doubleClickZoom.disable(), this.drawFeature ? (this.drawFeaturePointCount += 1, this._changeFeature(
        this.drawFeature.id,
        this.drawFeature.geometry.coordinates,
        "Polygon"
      )) : (this.drawFeature = {
        type: "Feature",
        id: "polygon" + Date.now(),
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [t.lngLat.lng, t.lngLat.lat],
              [t.lngLat.lng, t.lngLat.lat]
            ]
          ]
        }
      }, this.map.on("mousemove", this._boundHandleMove), this.map.on("dblclick", this._boundHandleDoubleClick), this.drawFeaturePointCount = 1);
    else if (this.mode == "rectangle")
      if (this.drawFeature) {
        const e = Math.min(
          this.drawFeature.properties.originPoint[0],
          t.lngLat.lng
        ), a = Math.max(
          this.drawFeature.properties.originPoint[0],
          t.lngLat.lng
        ), r = Math.min(
          this.drawFeature.properties.originPoint[1],
          t.lngLat.lat
        ), i = Math.max(
          this.drawFeature.properties.originPoint[1],
          t.lngLat.lat
        );
        this.drawFeature.geometry.coordinates[0] = [
          [e, i],
          [a, i],
          [a, r],
          [e, r],
          [e, i]
        ], this.callback(this.drawFeature), this._changeFeature(
          this.drawFeature.id,
          this.drawFeature.geometry.coordinates,
          "Polygon"
        ), this.map.off("mousemove", this._boundHandleMove), this.drawFeature = null, this.autoStop && this.stopDraw();
      } else
        this.drawFeature = {
          type: "Feature",
          id: "polygon" + Date.now(),
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [t.lngLat.lng, t.lngLat.lat],
                [t.lngLat.lng, t.lngLat.lat],
                [t.lngLat.lng, t.lngLat.lat],
                [t.lngLat.lng, t.lngLat.lat],
                [t.lngLat.lng, t.lngLat.lat]
              ]
            ]
          },
          properties: {
            originPoint: [t.lngLat.lng, t.lngLat.lat]
          }
        }, this.map.on("mousemove", this._boundHandleMove);
    else this.mode == "circle" && (this.drawFeature ? (this.map.off("mousemove", this._boundHandleMove), this.callback(this.drawFeature), this.drawFeature = null, this.autoStop && this.stopDraw()) : (this.drawFeature = {
      type: "Feature",
      id: "circle" + Date.now(),
      geometry: {
        type: "Point",
        coordinates: [t.lngLat.lng, t.lngLat.lat]
      },
      properties: {
        radio: 0,
        lat: t.lngLat.lat
      }
    }, this._addFeature(this.drawFeature), this.map.on("mousemove", this._boundHandleMove)));
  }
  _handleMove(t) {
    if (this.mode === "lineString" || this.mode === "line")
      this.drawFeature.geometry.coordinates[this.drawFeaturePointCount] ? this.drawFeature.geometry.coordinates[this.drawFeaturePointCount] = [
        t.lngLat.lng,
        t.lngLat.lat
      ] : this.drawFeature.geometry.coordinates.push([
        t.lngLat.lng,
        t.lngLat.lat
      ]), this._changeFeature(
        this.drawFeature.id,
        this.drawFeature.geometry.coordinates,
        "LineString"
      );
    else if (this.mode == "polygon")
      this.drawFeature.geometry.coordinates[0][this.drawFeaturePointCount] = [
        t.lngLat.lng,
        t.lngLat.lat
      ], this.drawFeature.geometry.coordinates[0][this.drawFeaturePointCount + 1] = this.drawFeature.geometry.coordinates[0][0], this._changeFeature(
        this.drawFeature.id,
        this.drawFeature.geometry.coordinates,
        "Polygon"
      );
    else if (this.mode == "rectangle") {
      const e = Math.min(
        this.drawFeature.properties.originPoint[0],
        t.lngLat.lng
      ), a = Math.max(
        this.drawFeature.properties.originPoint[0],
        t.lngLat.lng
      ), r = Math.min(
        this.drawFeature.properties.originPoint[1],
        t.lngLat.lat
      ), i = Math.max(
        this.drawFeature.properties.originPoint[1],
        t.lngLat.lat
      );
      this.drawFeature.geometry.coordinates[0] = [
        [e, i],
        [a, i],
        [a, r],
        [e, r],
        [e, i]
      ], this._changeFeature(
        this.drawFeature.id,
        this.drawFeature.geometry.coordinates,
        "Polygon"
      );
    } else if (this.mode == "circle") {
      const e = this.map.getSource("draw-source")._data.features;
      e.find((a) => a.id === this.drawFeature.id) ? e.find(
        (a) => a.id === this.drawFeature.id
      ).properties.radio = h(
        ...this.drawFeature.geometry.coordinates,
        t.lngLat.lng,
        t.lngLat.lat
      ) : (this.drawFeature.properties.radio = h(
        ...this.drawFeature.geometry.coordinates,
        t.lngLat.lng,
        t.lngLat.lat
      ), e.push(this.drawFeature)), this.map.getSource("draw-source").setData({
        type: "FeatureCollection",
        features: e
      });
    }
  }
  _handleDoubleClick(t) {
    this.map.off("mousemove", this._boundHandleMove), this.callback(this.drawFeature), this.drawFeature = null, this.drawFeaturePointCount = 0, this.map.off("dbclick", this._boundHandleDoubleClick), this.autoStop && this.stopDraw();
  }
  clearFeatures() {
    this.map.getSource("draw-source") && this.map.getSource("draw-source").setData({
      type: "FeatureCollection",
      features: []
    });
  }
  stopDraw() {
    this.map.getCanvas().style.cursor = this.lastMoustStyle, this.lastMoustStyle = void 0, this.map.off("click", this._boundHandleClick), this.map.off("dbclick", this._boundHandleDoubleClick), this.map.off("mousemove", this._boundHandleMove), this.drawFeature = null, requestAnimationFrame(() => {
      this.map.doubleClickZoom.enable();
    });
  }
  _addFeature(t) {
    const e = this.map.getSource("draw-source")._data.features;
    e.push(t), this.map.getSource("draw-source").setData({
      type: "FeatureCollection",
      features: e
    });
  }
  /**
   *
   * @param {string} featureID
   * @param {Array[Array]} coordinates
   * @param {'point' | 'line' | 'lineString' | 'polygon' | 'rectangle' | 'circle'} type
   */
  _changeFeature(t, e, a) {
    const r = this.map.getSource("draw-source")._data.features;
    r.find((i) => i.id === t) ? (r.find((i) => i.id === t).geometry.coordinates = e, this.map.getSource("draw-source").setData({
      type: "FeatureCollection",
      features: r
    })) : this._addFeature({
      type: "Feature",
      id: t,
      geometry: {
        type: a,
        coordinates: e
      }
    });
  }
  /**
   *
   * @param {'point' | 'line' | 'lineString' | 'polygon' | 'rectangle' | 'circle'} type
   */
  _addLayer(t) {
    t == "rectangle" && (t = "polygon"), t == "line" && (t = "lineString"), this.map.getSource("draw-source") || this.map.addSource("draw-source", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    }), this.map.getLayer("draw-" + t) || (t === "lineString" ? this.map.addLayer({
      id: "draw-lineString",
      type: "line",
      source: "draw-source",
      layout: this.lineLayout,
      filter: ["==", "$type", "LineString"],
      paint: this.linePaint
    }) : t === "polygon" ? this.map.addLayer({
      id: "draw-polygon",
      type: "fill",
      source: "draw-source",
      layout: this.polygonLayout,
      filter: ["==", "$type", "Polygon"],
      paint: this.polygonPaint
    }) : t === "point" ? this.map.addLayer({
      id: "draw-point",
      type: "circle",
      source: "draw-source",
      layout: this.pointLayout,
      filter: ["all", ["==", "$type", "Point"], ["!has", "radio"]],
      paint: this.pointPaint
    }) : t === "circle" && this.map.addLayer({
      id: "draw-circle",
      type: "circle",
      source: "draw-source",
      layout: {},
      filter: ["all", ["==", "$type", "Point"], ["has", "radio"]],
      paint: this.circlePaint
    }));
  }
}
function h(o, t, e, a) {
  const i = t * Math.PI / 180, u = a * Math.PI / 180, s = (a - t) * Math.PI / 180, l = (e - o) * Math.PI / 180, d = Math.sin(s / 2) * Math.sin(s / 2) + Math.cos(i) * Math.cos(u) * Math.sin(l / 2) * Math.sin(l / 2);
  return 6371e3 * 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d));
}
export {
  w as default
};
