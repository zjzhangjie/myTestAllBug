/*!
 * @license
 * 
 * dhtmlxGantt v.5.1.2 Professional Evaluation
 * This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.
 * 
 * (c) Dinamenta, UAB.
 * 
 */
Gantt.plugin(function(e) {
  !(function(e) {
    function t(a) {
      if (r[a]) return r[a].exports;
      var n = (r[a] = { i: a, l: !1, exports: {} });
      return e[a].call(n.exports, n, n.exports, t), (n.l = !0), n.exports;
    }
    var r = {};
    (t.m = e),
      (t.c = r),
      (t.d = function(e, r, a) {
        t.o(e, r) ||
          Object.defineProperty(e, r, {
            configurable: !1,
            enumerable: !0,
            get: a
          });
      }),
      (t.n = function(e) {
        var r =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return t.d(r, "a", r), r;
      }),
      (t.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (t.p = ""),
      t((t.s = 25));
  })({
    25: function(e, t, r) {
      e.exports = r(26);
    },
    26: function(t, r) {
      !(function() {
        function t(t) {
          if (!e.config.show_markers) return !1;
          if (!t.start_date) return !1;
          var r = e.getState();
          if (
            !(
              +t.start_date > +r.max_date ||
              (+t.end_date && +t.end_date < +r.min_date) ||
              +t.start_date < +r.min_date
            )
          ) {
            var a = document.createElement("div");
            a.setAttribute("marker_id", t.id);
            var n = "gantt_marker";
            e.templates.marker_class &&
              (n += " " + e.templates.marker_class(t)),
              t.css && (n += " " + t.css),
              t.title && (a.title = t.title),
              (a.className = n);
            var s = e.posFromDate(t.start_date);
            if (
              ((a.style.left = s + "px"),
              (a.style.height =
                Math.max(e.getRowTop(e.getVisibleTaskCount()), 0) + "px"),
              t.end_date)
            ) {
              var i = e.posFromDate(t.end_date);
              a.style.width = Math.max(i - s, 0) + "px";
            }
            return (
              t.text &&
                (a.innerHTML =
                  "<div class='gantt_marker_content' >" + t.text + "</div>"),
              a
            );
          }
        }
        function r() {
          if (e.$task_data) {
            var t = document.createElement("div");
            (t.className = "gantt_marker_area"),
              e.$task_data.appendChild(t),
              (e.$marker_area = t);
          }
        }
        e._markers ||
          (e._markers = e.createDatastore({
            name: "marker",
            initItem: function(t) {
              return (t.id = t.id || e.uid()), t;
            }
          })),
          (e.config.show_markers = !0),
          e.attachEvent("onBeforeGanttRender", function() {
            e.$marker_area || r();
          }),
          e.attachEvent("onGanttReady", function() {
            r(),
              e.$services
                .getService("layers")
                .createDataRender({
                  name: "marker",
                  defaultContainer: function() {
                    return e.$marker_area;
                  }
                })
                .addLayer(t);
          }),
          (e.getMarker = function(e) {
            return this._markers ? this._markers.getItem(e) : null;
          }),
          (e.addMarker = function(e) {
            return this._markers.addItem(e);
          }),
          (e.deleteMarker = function(e) {
            return (
              !!this._markers.exists(e) && (this._markers.removeItem(e), !0)
            );
          }),
          (e.updateMarker = function(e) {
            this._markers.refresh(e);
          }),
          (e._getMarkers = function() {
            return this._markers.getItems();
          }),
          (e.renderMarkers = function() {
            this._markers.refresh();
          });
      })();
    }
  });
});
//# sourceMappingURL=dhtmlxgantt_marker.js.map
