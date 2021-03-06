pv.SvgScene.wedge = function(scenes) {
  var e = scenes.$g.firstChild;

  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;
    var fill = s.fillStyle, stroke = s.strokeStyle;
    if (!fill.opacity && !stroke.opacity) continue;

    /* points */
    var r1 = s.innerRadius, r2 = s.outerRadius, a = Math.abs(s.angle), p;
    if (a >= 2 * Math.PI) {
      if (r1) {
        p = "M0," + r2
            + "A" + r2 + "," + r2 + " 0 1,1 0," + (-r2)
            + "A" + r2 + "," + r2 + " 0 1,1 0," + r2
            + "M0," + r1
            + "A" + r1 + "," + r1 + " 0 1,1 0," + (-r1)
            + "A" + r1 + "," + r1 + " 0 1,1 0," + r1
            + "Z";
      } else {
        p = "M0," + r2
            + "A" + r2 + "," + r2 + " 0 1,1 0," + (-r2)
            + "A" + r2 + "," + r2 + " 0 1,1 0," + r2
            + "Z";
      }
    } else {
      var sa = Math.min(s.startAngle, s.endAngle),
          ea = Math.max(s.startAngle, s.endAngle),
          c1 = Math.cos(sa), c2 = Math.cos(ea),
          s1 = Math.sin(sa), s2 = Math.sin(ea);
      if (r1) {
        p = "M" + r2 * c1 + "," + r2 * s1
            + "A" + r2 + "," + r2 + " 0 "
            + ((a < Math.PI) ? "0" : "1") + ",1 "
            + r2 * c2 + "," + r2 * s2
            + "L" + r1 * c2 + "," + r1 * s2
            + "A" + r1 + "," + r1 + " 0 "
            + ((a < Math.PI) ? "0" : "1") + ",0 "
            + r1 * c1 + "," + r1 * s1 + "Z";
      } else {
        p = "M" + r2 * c1 + "," + r2 * s1
            + "A" + r2 + "," + r2 + " 0 "
            + ((a < Math.PI) ? "0" : "1") + ",1 "
            + r2 * c2 + "," + r2 * s2 + "L0,0Z";
      }
    }
    
    this.addFillStyleDefinition(scenes, fill);
    this.addFillStyleDefinition(scenes, stroke);
    
    e = this.expect(e, "path", scenes, i, {
        "shape-rendering": s.antialias ? null : "crispEdges",
        "pointer-events": s.events,
        "cursor": s.cursor,
        "transform": "translate(" + s.left + "," + s.top + ")",
        "d": p,
        "fill": fill.color,
        "fill-rule": "evenodd",
        "fill-opacity": fill.opacity || null,
        "stroke": stroke.color,
        "stroke-opacity": stroke.opacity || null,
        "stroke-width": stroke.opacity ? s.lineWidth / this.scale : null,
        "stroke-linejoin":   s.lineJoin,
        "stroke-miterlimit": s.strokeMiterLimit,
        "stroke-linecap":    s.lineCap,
        "stroke-dasharray":  stroke.opacity ? this.parseDasharray(s) : null
      });

    if(s.svg) this.setAttributes(e, s.svg);
    if(s.css) this.setStyle(e, s.css);

    e = this.append(e, scenes, i);
  }
  
  /*
  // DEBUG BEG
  var mark  = scenes.mark;
  for (var i = 0; i < scenes.length; i+=2) {
      var shape = mark.getShape(scenes, i);
      
      // POINTS
      var points = shape.points();
      points.forEach(function(p){
          e = this.expect(e, 'circle', scenes, i, {
              cx: p.x,
              cy: p.y,
              r:  2,
              fill: 'black'
          });
          e = this.append(e, scenes, i);
      }, this);
      
      // EDGES
      var edges = shape.edges();
      edges.forEach(function(edge){
          if(edge instanceof pv.Shape.Line){
              e = this.expect(e, 'path', scenes, 0, {
                  d: "M" + edge.x + "," + edge.y + "L" + edge.x2 + "," + edge.y2,
                  stroke: 'green',
                  'stroke-width': 1
              });
              
          } else if (edge instanceof pv.Shape.Arc){
              var sa = Math.min(edge.startAngle, edge.endAngle),
                  ea = Math.max(edge.startAngle, edge.endAngle),
                  c1 = Math.cos(sa), c2 = Math.cos(ea),
                  s1 = Math.sin(sa), s2 = Math.sin(ea),
                  r  = edge.radius;
          
              var p = "M" + r * c1 + "," + r * s1 + 
                      "A" + r + "," + r + " 0 "
                      + ((edge.angleSpan < Math.PI) ? "0" : "1") + ",1 "
                      + r * c2 + "," + r * s2;
              
              e = this.expect(e, 'path', scenes, 0, {
                  d: p,
                  transform: "translate(" + edge.x + "," + edge.y + ")",
                  stroke: 'red',
                  'stroke-width': 1
              });
          }
          
          e = this.append(e, scenes, i);
      }, this);
  }
  // DEBUG END
  */
  return e;
};
