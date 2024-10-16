/**************************************************************

 PLUGINS INDEXING
 |
 |
 |___ Avoid Console
 |___ Slick Slider
 |___ Meanmenu
 |
 |
 |___ END STYLESHEET INDEXING

 ***************************************************************/


/*************************************
 Avoid Console
 **************************************/

// Avoid `console` errors in browsers that lack a console.
(function () {
    let method;
    const noop = function () {
    };
    let methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    let length = methods.length;
    const console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.


/*************************************
 Slick Slider
 **************************************/

/*
  Version: 1.9.0
  Author: Ken Wheeler
  Website: http://kenwheeler.github.io
  Docs: http://kenwheeler.github.io/slick
  Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues
 */
(function (i) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery)
})(function (i) {
    "use strict";
    var e = window.Slick || {};
    e = function () {
        function e(e, o) {
            var s, n = this;
            n.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: i(e),
                appendDots: i(e),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function (e, t) {
                    return i('<button type="button" />').text(t + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            }, n.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            }, i.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, n.rowCount = 1, n.shouldClick = !0, n.$slider = i(e), n.$slidesCache = null, n.transformType = null, n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, n.windowTimer = null, s = i(e).data("slick") || {}, n.options = i.extend({}, n.defaults, o, s), n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, "undefined" != typeof document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = i.proxy(n.autoPlay, n), n.autoPlayClear = i.proxy(n.autoPlayClear, n), n.autoPlayIterator = i.proxy(n.autoPlayIterator, n), n.changeSlide = i.proxy(n.changeSlide, n), n.clickHandler = i.proxy(n.clickHandler, n), n.selectHandler = i.proxy(n.selectHandler, n), n.setPosition = i.proxy(n.setPosition, n), n.swipeHandler = i.proxy(n.swipeHandler, n), n.dragHandler = i.proxy(n.dragHandler, n), n.keyHandler = i.proxy(n.keyHandler, n), n.instanceUid = t++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, n.registerBreakpoints(), n.init(!0)
        }

        var t = 0;
        return e
    }(), e.prototype.activateADA = function () {
        var i = this;
        i.$slideTrack.find(".slick-active").attr({"aria-hidden": "false"}).find("a, input, button, select").attr({tabindex: "0"})
    }, e.prototype.addSlide = e.prototype.slickAdd = function (e, t, o) {
        var s = this;
        if ("boolean" == typeof t) o = t, t = null; else if (t < 0 || t >= s.slideCount) return !1;
        s.unload(), "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : o === !0 ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slides.each(function (e, t) {
            i(t).attr("data-slick-index", e)
        }), s.$slidesCache = s.$slides, s.reinit()
    }, e.prototype.animateHeight = function () {
        var i = this;
        if (1 === i.options.slidesToShow && i.options.adaptiveHeight === !0 && i.options.vertical === !1) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.animate({height: e}, i.options.speed)
        }
    }, e.prototype.animateSlide = function (e, t) {
        var o = {}, s = this;
        s.animateHeight(), s.options.rtl === !0 && s.options.vertical === !1 && (e = -e), s.transformsEnabled === !1 ? s.options.vertical === !1 ? s.$slideTrack.animate({left: e}, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({top: e}, s.options.speed, s.options.easing, t) : s.cssTransitions === !1 ? (s.options.rtl === !0 && (s.currentLeft = -s.currentLeft), i({animStart: s.currentLeft}).animate({animStart: e}, {
            duration: s.options.speed,
            easing: s.options.easing,
            step: function (i) {
                i = Math.ceil(i), s.options.vertical === !1 ? (o[s.animType] = "translate(" + i + "px, 0px)", s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o))
            },
            complete: function () {
                t && t.call()
            }
        })) : (s.applyTransition(), e = Math.ceil(e), s.options.vertical === !1 ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(o), t && setTimeout(function () {
            s.disableTransition(), t.call()
        }, s.options.speed))
    }, e.prototype.getNavTarget = function () {
        var e = this, t = e.options.asNavFor;
        return t && null !== t && (t = i(t).not(e.$slider)), t
    }, e.prototype.asNavFor = function (e) {
        var t = this, o = t.getNavTarget();
        null !== o && "object" == typeof o && o.each(function () {
            var t = i(this).slick("getSlick");
            t.unslicked || t.slideHandler(e, !0)
        })
    }, e.prototype.applyTransition = function (i) {
        var e = this, t = {};
        e.options.fade === !1 ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, e.options.fade === !1 ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }, e.prototype.autoPlay = function () {
        var i = this;
        i.autoPlayClear(), i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed))
    }, e.prototype.autoPlayClear = function () {
        var i = this;
        i.autoPlayTimer && clearInterval(i.autoPlayTimer)
    }, e.prototype.autoPlayIterator = function () {
        var i = this, e = i.currentSlide + i.options.slidesToScroll;
        i.paused || i.interrupted || i.focussed || (i.options.infinite === !1 && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, i.currentSlide - 1 === 0 && (i.direction = 1))), i.slideHandler(e))
    }, e.prototype.buildArrows = function () {
        var e = this;
        e.options.arrows === !0 && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), e.options.infinite !== !0 && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }, e.prototype.buildDots = function () {
        var e, t, o = this;
        if (o.options.dots === !0 && o.slideCount > o.options.slidesToShow) {
            for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), e = 0; e <= o.getDotCount(); e += 1) t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
            o.$dots = t.appendTo(o.options.appendDots), o.$dots.find("li").first().addClass("slick-active")
        }
    }, e.prototype.buildOut = function () {
        var e = this;
        e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function (e, t) {
            i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "")
        }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), e.options.centerMode !== !0 && e.options.swipeToSlide !== !0 || (e.options.slidesToScroll = 1), i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.options.draggable === !0 && e.$list.addClass("draggable")
    }, e.prototype.buildRows = function () {
        var i, e, t, o, s, n, r, l = this;
        if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 0) {
            for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++) {
                var d = document.createElement("div");
                for (e = 0; e < l.options.rows; e++) {
                    var a = document.createElement("div");
                    for (t = 0; t < l.options.slidesPerRow; t++) {
                        var c = i * r + (e * l.options.slidesPerRow + t);
                        n.get(c) && a.appendChild(n.get(c))
                    }
                    d.appendChild(a)
                }
                o.appendChild(d)
            }
            l.$slider.empty().append(o), l.$slider.children().children().children().css({
                width: 100 / l.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }, e.prototype.checkResponsive = function (e, t) {
        var o, s, n, r = this, l = !1, d = r.$slider.width(), a = window.innerWidth || i(window).width();
        if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
            s = null;
            for (o in r.breakpoints) r.breakpoints.hasOwnProperty(o) && (r.originalSettings.mobileFirst === !1 ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
            null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), e === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), e === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, e === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(e), l = s), e || l === !1 || r.$slider.trigger("breakpoint", [r, l])
        }
    }, e.prototype.changeSlide = function (e, t) {
        var o, s, n, r = this, l = i(e.currentTarget);
        switch (l.is("a") && e.preventDefault(), l.is("li") || (l = l.closest("li")), n = r.slideCount % r.options.slidesToScroll !== 0, o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
            case"previous":
                s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
                break;
            case"next":
                s = 0 === o ? r.options.slidesToScroll : o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
                break;
            case"index":
                var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
                r.slideHandler(r.checkNavigable(d), !1, t), l.children().trigger("focus");
                break;
            default:
                return
        }
    }, e.prototype.checkNavigable = function (i) {
        var e, t, o = this;
        if (e = o.getNavigableIndexes(), t = 0, i > e[e.length - 1]) i = e[e.length - 1]; else for (var s in e) {
            if (i < e[s]) {
                i = t;
                break
            }
            t = e[s]
        }
        return i
    }, e.prototype.cleanUpEvents = function () {
        var e = this;
        e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), e.options.accessibility === !0 && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), e.options.accessibility === !0 && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), i(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), e.options.accessibility === !0 && e.$list.off("keydown.slick", e.keyHandler), e.options.focusOnSelect === !0 && i(e.$slideTrack).children().off("click.slick", e.selectHandler), i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), i(window).off("resize.slick.slick-" + e.instanceUid, e.resize), i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
    }, e.prototype.cleanUpSlideEvents = function () {
        var e = this;
        e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }, e.prototype.cleanUpRows = function () {
        var i, e = this;
        e.options.rows > 0 && (i = e.$slides.children().children(), i.removeAttr("style"), e.$slider.empty().append(i))
    }, e.prototype.clickHandler = function (i) {
        var e = this;
        e.shouldClick === !1 && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault())
    }, e.prototype.destroy = function (e) {
        var t = this;
        t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), i(".slick-cloned", t.$slider).detach(), t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
            i(this).attr("style", i(this).data("originalStyling"))
        }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), t.unslicked = !0, e || t.$slider.trigger("destroy", [t])
    }, e.prototype.disableTransition = function (i) {
        var e = this, t = {};
        t[e.transitionType] = "", e.options.fade === !1 ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }, e.prototype.fadeSlide = function (i, e) {
        var t = this;
        t.cssTransitions === !1 ? (t.$slides.eq(i).css({zIndex: t.options.zIndex}), t.$slides.eq(i).animate({opacity: 1}, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
            opacity: 1,
            zIndex: t.options.zIndex
        }), e && setTimeout(function () {
            t.disableTransition(i), e.call()
        }, t.options.speed))
    }, e.prototype.fadeSlideOut = function (i) {
        var e = this;
        e.cssTransitions === !1 ? e.$slides.eq(i).animate({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }))
    }, e.prototype.filterSlides = e.prototype.slickFilter = function (i) {
        var e = this;
        null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit())
    }, e.prototype.focusHandler = function () {
        var e = this;
        e.$slider.off("focus.slick blur.slick").on("focus.slick", "*", function (t) {
            var o = i(this);
            setTimeout(function () {
                e.options.pauseOnFocus && o.is(":focus") && (e.focussed = !0, e.autoPlay())
            }, 0)
        }).on("blur.slick", "*", function (t) {
            i(this);
            e.options.pauseOnFocus && (e.focussed = !1, e.autoPlay())
        })
    }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function () {
        var i = this;
        return i.currentSlide
    }, e.prototype.getDotCount = function () {
        var i = this, e = 0, t = 0, o = 0;
        if (i.options.infinite === !0) if (i.slideCount <= i.options.slidesToShow) ++o; else for (; e < i.slideCount;) ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow; else if (i.options.centerMode === !0) o = i.slideCount; else if (i.options.asNavFor) for (; e < i.slideCount;) ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow; else o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
        return o - 1
    }, e.prototype.getLeft = function (i) {
        var e, t, o, s, n = this, r = 0;
        return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), n.options.infinite === !0 ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, s = -1, n.options.vertical === !0 && n.options.centerMode === !0 && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll !== 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, r = 0), n.options.centerMode === !0 && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : n.options.centerMode === !0 && n.options.infinite === !0 ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : n.options.centerMode === !0 && (n.slideOffset = 0, n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = n.options.vertical === !1 ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, n.options.variableWidth === !0 && (o = n.slideCount <= n.options.slidesToShow || n.options.infinite === !1 ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), e = n.options.rtl === !0 ? o[0] ? (n.$slideTrack.width() - o[0].offsetLeft - o.width()) * -1 : 0 : o[0] ? o[0].offsetLeft * -1 : 0, n.options.centerMode === !0 && (o = n.slideCount <= n.options.slidesToShow || n.options.infinite === !1 ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), e = n.options.rtl === !0 ? o[0] ? (n.$slideTrack.width() - o[0].offsetLeft - o.width()) * -1 : 0 : o[0] ? o[0].offsetLeft * -1 : 0, e += (n.$list.width() - o.outerWidth()) / 2)), e
    }, e.prototype.getOption = e.prototype.slickGetOption = function (i) {
        var e = this;
        return e.options[i]
    }, e.prototype.getNavigableIndexes = function () {
        var i, e = this, t = 0, o = 0, s = [];
        for (e.options.infinite === !1 ? i = e.slideCount : (t = e.options.slidesToScroll * -1, o = e.options.slidesToScroll * -1, i = 2 * e.slideCount); t < i;) s.push(t), t = o + e.options.slidesToScroll, o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        return s
    }, e.prototype.getSlick = function () {
        return this
    }, e.prototype.getSlideCount = function () {
        var e, t, o, s, n = this;
        return s = n.options.centerMode === !0 ? Math.floor(n.$list.width() / 2) : 0, o = n.swipeLeft * -1 + s, n.options.swipeToSlide === !0 ? (n.$slideTrack.find(".slick-slide").each(function (e, s) {
            var r, l, d;
            if (r = i(s).outerWidth(), l = s.offsetLeft, n.options.centerMode !== !0 && (l += r / 2), d = l + r, o < d) return t = s, !1
        }), e = Math.abs(i(t).attr("data-slick-index") - n.currentSlide) || 1) : n.options.slidesToScroll
    }, e.prototype.goTo = e.prototype.slickGoTo = function (i, e) {
        var t = this;
        t.changeSlide({data: {message: "index", index: parseInt(i)}}, e)
    }, e.prototype.init = function (e) {
        var t = this;
        i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [t]), t.options.accessibility === !0 && t.initADA(), t.options.autoplay && (t.paused = !1, t.autoPlay())
    }, e.prototype.initADA = function () {
        var e = this, t = Math.ceil(e.slideCount / e.options.slidesToShow),
            o = e.getNavigableIndexes().filter(function (i) {
                return i >= 0 && i < e.slideCount
            });
        e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({tabindex: "-1"}), null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function (t) {
            var s = o.indexOf(t);
            if (i(this).attr({role: "tabpanel", id: "slick-slide" + e.instanceUid + t, tabindex: -1}), s !== -1) {
                var n = "slick-slide-control" + e.instanceUid + s;
                i("#" + n).length && i(this).attr({"aria-describedby": n})
            }
        }), e.$dots.attr("role", "tablist").find("li").each(function (s) {
            var n = o[s];
            i(this).attr({role: "presentation"}), i(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + e.instanceUid + s,
                "aria-controls": "slick-slide" + e.instanceUid + n,
                "aria-label": s + 1 + " of " + t,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(e.currentSlide).find("button").attr({"aria-selected": "true", tabindex: "0"}).end());
        for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++) e.options.focusOnChange ? e.$slides.eq(s).attr({tabindex: "0"}) : e.$slides.eq(s).removeAttr("tabindex");
        e.activateADA()
    }, e.prototype.initArrowEvents = function () {
        var i = this;
        i.options.arrows === !0 && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {message: "previous"}, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {message: "next"}, i.changeSlide), i.options.accessibility === !0 && (i.$prevArrow.on("keydown.slick", i.keyHandler), i.$nextArrow.on("keydown.slick", i.keyHandler)))
    }, e.prototype.initDotEvents = function () {
        var e = this;
        e.options.dots === !0 && e.slideCount > e.options.slidesToShow && (i("li", e.$dots).on("click.slick", {message: "index"}, e.changeSlide), e.options.accessibility === !0 && e.$dots.on("keydown.slick", e.keyHandler)), e.options.dots === !0 && e.options.pauseOnDotsHover === !0 && e.slideCount > e.options.slidesToShow && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }, e.prototype.initSlideEvents = function () {
        var e = this;
        e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)))
    }, e.prototype.initializeEvents = function () {
        var e = this;
        e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {action: "start"}, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {action: "move"}, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {action: "end"}, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {action: "end"}, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), i(document).on(e.visibilityChange, i.proxy(e.visibility, e)), e.options.accessibility === !0 && e.$list.on("keydown.slick", e.keyHandler), e.options.focusOnSelect === !0 && i(e.$slideTrack).children().on("click.slick", e.selectHandler), i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)), i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)), i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), i(e.setPosition)
    }, e.prototype.initUI = function () {
        var i = this;
        i.options.arrows === !0 && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), i.$nextArrow.show()), i.options.dots === !0 && i.slideCount > i.options.slidesToShow && i.$dots.show()
    }, e.prototype.keyHandler = function (i) {
        var e = this;
        i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && e.options.accessibility === !0 ? e.changeSlide({data: {message: e.options.rtl === !0 ? "next" : "previous"}}) : 39 === i.keyCode && e.options.accessibility === !0 && e.changeSlide({data: {message: e.options.rtl === !0 ? "previous" : "next"}}))
    }, e.prototype.lazyLoad = function () {
        function e(e) {
            i("img[data-lazy]", e).each(function () {
                var e = i(this), t = i(this).attr("data-lazy"), o = i(this).attr("data-srcset"),
                    s = i(this).attr("data-sizes") || r.$slider.attr("data-sizes"), n = document.createElement("img");
                n.onload = function () {
                    e.animate({opacity: 0}, 100, function () {
                        o && (e.attr("srcset", o), s && e.attr("sizes", s)), e.attr("src", t).animate({opacity: 1}, 200, function () {
                            e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }), r.$slider.trigger("lazyLoaded", [r, e, t])
                    })
                }, n.onerror = function () {
                    e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), r.$slider.trigger("lazyLoadError", [r, e, t])
                }, n.src = t
            })
        }

        var t, o, s, n, r = this;
        if (r.options.centerMode === !0 ? r.options.infinite === !0 ? (s = r.currentSlide + (r.options.slidesToShow / 2 + 1), n = s + r.options.slidesToShow + 2) : (s = Math.max(0, r.currentSlide - (r.options.slidesToShow / 2 + 1)), n = 2 + (r.options.slidesToShow / 2 + 1) + r.currentSlide) : (s = r.options.infinite ? r.options.slidesToShow + r.currentSlide : r.currentSlide, n = Math.ceil(s + r.options.slidesToShow), r.options.fade === !0 && (s > 0 && s--, n <= r.slideCount && n++)), t = r.$slider.find(".slick-slide").slice(s, n), "anticipated" === r.options.lazyLoad) for (var l = s - 1, d = n, a = r.$slider.find(".slick-slide"), c = 0; c < r.options.slidesToScroll; c++) l < 0 && (l = r.slideCount - 1), t = t.add(a.eq(l)), t = t.add(a.eq(d)), l--, d++;
        e(t), r.slideCount <= r.options.slidesToShow ? (o = r.$slider.find(".slick-slide"), e(o)) : r.currentSlide >= r.slideCount - r.options.slidesToShow ? (o = r.$slider.find(".slick-cloned").slice(0, r.options.slidesToShow), e(o)) : 0 === r.currentSlide && (o = r.$slider.find(".slick-cloned").slice(r.options.slidesToShow * -1), e(o))
    }, e.prototype.loadSlider = function () {
        var i = this;
        i.setPosition(), i.$slideTrack.css({opacity: 1}), i.$slider.removeClass("slick-loading"), i.initUI(), "progressive" === i.options.lazyLoad && i.progressiveLazyLoad()
    }, e.prototype.next = e.prototype.slickNext = function () {
        var i = this;
        i.changeSlide({data: {message: "next"}})
    }, e.prototype.orientationChange = function () {
        var i = this;
        i.checkResponsive(), i.setPosition()
    }, e.prototype.pause = e.prototype.slickPause = function () {
        var i = this;
        i.autoPlayClear(), i.paused = !0
    }, e.prototype.play = e.prototype.slickPlay = function () {
        var i = this;
        i.autoPlay(), i.options.autoplay = !0, i.paused = !1, i.focussed = !1, i.interrupted = !1
    }, e.prototype.postSlide = function (e) {
        var t = this;
        if (!t.unslicked && (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), t.options.accessibility === !0 && (t.initADA(), t.options.focusOnChange))) {
            var o = i(t.$slides.get(t.currentSlide));
            o.attr("tabindex", 0).focus()
        }
    }, e.prototype.prev = e.prototype.slickPrev = function () {
        var i = this;
        i.changeSlide({data: {message: "previous"}})
    }, e.prototype.preventDefault = function (i) {
        i.preventDefault()
    }, e.prototype.progressiveLazyLoad = function (e) {
        e = e || 1;
        var t, o, s, n, r, l = this, d = i("img[data-lazy]", l.$slider);
        d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), r = document.createElement("img"), r.onload = function () {
            s && (t.attr("srcset", s), n && t.attr("sizes", n)), t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), l.options.adaptiveHeight === !0 && l.setPosition(), l.$slider.trigger("lazyLoaded", [l, t, o]), l.progressiveLazyLoad()
        }, r.onerror = function () {
            e < 3 ? setTimeout(function () {
                l.progressiveLazyLoad(e + 1)
            }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), l.$slider.trigger("lazyLoadError", [l, t, o]), l.progressiveLazyLoad())
        }, r.src = o) : l.$slider.trigger("allImagesLoaded", [l])
    }, e.prototype.refresh = function (e) {
        var t, o, s = this;
        o = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > o && (s.currentSlide = o), s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), t = s.currentSlide, s.destroy(!0), i.extend(s, s.initials, {currentSlide: t}), s.init(), e || s.changeSlide({
            data: {
                message: "index",
                index: t
            }
        }, !1)
    }, e.prototype.registerBreakpoints = function () {
        var e, t, o, s = this, n = s.options.responsive || null;
        if ("array" === i.type(n) && n.length) {
            s.respondTo = s.options.respondTo || "window";
            for (e in n) if (o = s.breakpoints.length - 1, n.hasOwnProperty(e)) {
                for (t = n[e].breakpoint; o >= 0;) s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1), o--;
                s.breakpoints.push(t), s.breakpointSettings[t] = n[e].settings
            }
            s.breakpoints.sort(function (i, e) {
                return s.options.mobileFirst ? i - e : e - i
            })
        }
    }, e.prototype.reinit = function () {
        var e = this;
        e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), e.options.focusOnSelect === !0 && i(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e])
    }, e.prototype.resize = function () {
        var e = this;
        i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function () {
            e.windowWidth = i(window).width(), e.checkResponsive(), e.unslicked || e.setPosition()
        }, 50))
    }, e.prototype.removeSlide = e.prototype.slickRemove = function (i, e, t) {
        var o = this;
        return "boolean" == typeof i ? (e = i, i = e === !0 ? 0 : o.slideCount - 1) : i = e === !0 ? --i : i, !(o.slideCount < 1 || i < 0 || i > o.slideCount - 1) && (o.unload(), t === !0 ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, void o.reinit())
    }, e.prototype.setCSS = function (i) {
        var e, t, o = this, s = {};
        o.options.rtl === !0 && (i = -i), e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px", t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px", s[o.positionProp] = i, o.transformsEnabled === !1 ? o.$slideTrack.css(s) : (s = {}, o.cssTransitions === !1 ? (s[o.animType] = "translate(" + e + ", " + t + ")", o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", o.$slideTrack.css(s)))
    }, e.prototype.setDimensions = function () {
        var i = this;
        i.options.vertical === !1 ? i.options.centerMode === !0 && i.$list.css({padding: "0px " + i.options.centerPadding}) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), i.options.centerMode === !0 && i.$list.css({padding: i.options.centerPadding + " 0px"})), i.listWidth = i.$list.width(), i.listHeight = i.$list.height(), i.options.vertical === !1 && i.options.variableWidth === !1 ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : i.options.variableWidth === !0 ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
        var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
        i.options.variableWidth === !1 && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e)
    }, e.prototype.setFade = function () {
        var e, t = this;
        t.$slides.each(function (o, s) {
            e = t.slideWidth * o * -1, t.options.rtl === !0 ? i(s).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0
            }) : i(s).css({position: "relative", left: e, top: 0, zIndex: t.options.zIndex - 2, opacity: 0})
        }), t.$slides.eq(t.currentSlide).css({zIndex: t.options.zIndex - 1, opacity: 1})
    }, e.prototype.setHeight = function () {
        var i = this;
        if (1 === i.options.slidesToShow && i.options.adaptiveHeight === !0 && i.options.vertical === !1) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.css("height", e)
        }
    }, e.prototype.setOption = e.prototype.slickSetOption = function () {
        var e, t, o, s, n, r = this, l = !1;
        if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : "undefined" != typeof arguments[1] && (n = "single")), "single" === n) r.options[o] = s; else if ("multiple" === n) i.each(o, function (i, e) {
            r.options[i] = e
        }); else if ("responsive" === n) for (t in s) if ("array" !== i.type(r.options.responsive)) r.options.responsive = [s[t]]; else {
            for (e = r.options.responsive.length - 1; e >= 0;) r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1), e--;
            r.options.responsive.push(s[t])
        }
        l && (r.unload(), r.reinit())
    }, e.prototype.setPosition = function () {
        var i = this;
        i.setDimensions(), i.setHeight(), i.options.fade === !1 ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(), i.$slider.trigger("setPosition", [i])
    }, e.prototype.setProps = function () {
        var i = this, e = document.body.style;
        i.positionProp = i.options.vertical === !0 ? "top" : "left",
            "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"), void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || i.options.useCSS === !0 && (i.cssTransitions = !0), i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex), void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)), void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)), void 0 !== e.transform && i.animType !== !1 && (i.animType = "transform", i.transformType = "transform", i.transitionType = "transition"), i.transformsEnabled = i.options.useTransform && null !== i.animType && i.animType !== !1
    }, e.prototype.setSlideClasses = function (i) {
        var e, t, o, s, n = this;
        if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), n.$slides.eq(i).addClass("slick-current"), n.options.centerMode === !0) {
            var r = n.options.slidesToShow % 2 === 0 ? 1 : 0;
            e = Math.floor(n.options.slidesToShow / 2), n.options.infinite === !0 && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")), n.$slides.eq(i).addClass("slick-center")
        } else i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, o = n.options.infinite === !0 ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad()
    }, e.prototype.setupInfinite = function () {
        var e, t, o, s = this;
        if (s.options.fade === !0 && (s.options.centerMode = !1), s.options.infinite === !0 && s.options.fade === !1 && (t = null, s.slideCount > s.options.slidesToShow)) {
            for (o = s.options.centerMode === !0 ? s.options.slidesToShow + 1 : s.options.slidesToShow, e = s.slideCount; e > s.slideCount - o; e -= 1) t = e - 1, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
            for (e = 0; e < o + s.slideCount; e += 1) t = e, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
            s.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
                i(this).attr("id", "")
            })
        }
    }, e.prototype.interrupt = function (i) {
        var e = this;
        i || e.autoPlay(), e.interrupted = i
    }, e.prototype.selectHandler = function (e) {
        var t = this, o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"),
            s = parseInt(o.attr("data-slick-index"));
        return s || (s = 0), t.slideCount <= t.options.slidesToShow ? void t.slideHandler(s, !1, !0) : void t.slideHandler(s)
    }, e.prototype.slideHandler = function (i, e, t) {
        var o, s, n, r, l, d = null, a = this;
        if (e = e || !1, !(a.animating === !0 && a.options.waitForAnimate === !0 || a.options.fade === !0 && a.currentSlide === i)) return e === !1 && a.asNavFor(i), o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, a.options.infinite === !1 && a.options.centerMode === !1 && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll) ? void (a.options.fade === !1 && (o = a.currentSlide, t !== !0 && a.slideCount > a.options.slidesToShow ? a.animateSlide(r, function () {
            a.postSlide(o)
        }) : a.postSlide(o))) : a.options.infinite === !1 && a.options.centerMode === !0 && (i < 0 || i > a.slideCount - a.options.slidesToScroll) ? void (a.options.fade === !1 && (o = a.currentSlide, t !== !0 && a.slideCount > a.options.slidesToShow ? a.animateSlide(r, function () {
            a.postSlide(o)
        }) : a.postSlide(o))) : (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll !== 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll !== 0 ? 0 : o - a.slideCount : o, a.animating = !0, a.$slider.trigger("beforeChange", [a, a.currentSlide, s]), n = a.currentSlide, a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (l = a.getNavTarget(), l = l.slick("getSlick"), l.slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide)), a.updateDots(), a.updateArrows(), a.options.fade === !0 ? (t !== !0 ? (a.fadeSlideOut(n), a.fadeSlide(s, function () {
            a.postSlide(s)
        })) : a.postSlide(s), void a.animateHeight()) : void (t !== !0 && a.slideCount > a.options.slidesToShow ? a.animateSlide(d, function () {
            a.postSlide(s)
        }) : a.postSlide(s)))
    }, e.prototype.startLoad = function () {
        var i = this;
        i.options.arrows === !0 && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), i.$nextArrow.hide()), i.options.dots === !0 && i.slideCount > i.options.slidesToShow && i.$dots.hide(), i.$slider.addClass("slick-loading")
    }, e.prototype.swipeDirection = function () {
        var i, e, t, o, s = this;
        return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, t = Math.atan2(e, i), o = Math.round(180 * t / Math.PI), o < 0 && (o = 360 - Math.abs(o)), o <= 45 && o >= 0 ? s.options.rtl === !1 ? "left" : "right" : o <= 360 && o >= 315 ? s.options.rtl === !1 ? "left" : "right" : o >= 135 && o <= 225 ? s.options.rtl === !1 ? "right" : "left" : s.options.verticalSwiping === !0 ? o >= 35 && o <= 135 ? "down" : "up" : "vertical"
    }, e.prototype.swipeEnd = function (i) {
        var e, t, o = this;
        if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1, !1;
        if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX) return !1;
        if (o.touchObject.edgeHit === !0 && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe) {
            switch (t = o.swipeDirection()) {
                case"left":
                case"down":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), o.currentDirection = 0;
                    break;
                case"right":
                case"up":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), o.currentDirection = 1
            }
            "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [o, t]))
        } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), o.touchObject = {})
    }, e.prototype.swipeHandler = function (i) {
        var e = this;
        if (!(e.options.swipe === !1 || "ontouchend" in document && e.options.swipe === !1 || e.options.draggable === !1 && i.type.indexOf("mouse") !== -1)) switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, e.options.verticalSwiping === !0 && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), i.data.action) {
            case"start":
                e.swipeStart(i);
                break;
            case"move":
                e.swipeMove(i);
                break;
            case"end":
                e.swipeEnd(i)
        }
    }, e.prototype.swipeMove = function (i) {
        var e, t, o, s, n, r, l = this;
        return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (l.options.verticalSwiping === !0 && (l.touchObject.swipeLength = r), t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, i.preventDefault()), s = (l.options.rtl === !1 ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), l.options.verticalSwiping === !0 && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, l.options.infinite === !1 && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, l.touchObject.edgeHit = !0), l.options.vertical === !1 ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, l.options.verticalSwiping === !0 && (l.swipeLeft = e + o * s), l.options.fade !== !0 && l.options.touchMove !== !1 && (l.animating === !0 ? (l.swipeLeft = null, !1) : void l.setCSS(l.swipeLeft))))
    }, e.prototype.swipeStart = function (i) {
        var e, t = this;
        return t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow ? (t.touchObject = {}, !1) : (void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, void (t.dragging = !0))
    }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function () {
        var i = this;
        null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), i.$slidesCache.appendTo(i.$slideTrack), i.reinit())
    }, e.prototype.unload = function () {
        var e = this;
        i(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }, e.prototype.unslick = function (i) {
        var e = this;
        e.$slider.trigger("unslick", [e, i]), e.destroy()
    }, e.prototype.updateArrows = function () {
        var i, e = this;
        i = Math.floor(e.options.slidesToShow / 2), e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && e.options.centerMode === !1 ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && e.options.centerMode === !0 && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }, e.prototype.updateDots = function () {
        var i = this;
        null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"))
    }, e.prototype.visibility = function () {
        var i = this;
        i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1)
    }, i.fn.slick = function () {
        var i, t, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), r = o.length;
        for (i = 0; i < r; i++) if ("object" == typeof s || "undefined" == typeof s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), "undefined" != typeof t) return t;
        return o
    }
});


/*  jQuery Nice Select - v1.0
https://github.com/hernansartorio/jquery-nice-select
Made by Hernán Sartorio
*/
!function (e) {
    e.fn.niceSelect = function (t) {
        function s(t) {
            t.after(e("<div></div>").addClass("nice-select").addClass(t.attr("class") || "").addClass(t.attr("disabled") ? "disabled" : "").attr("tabindex", t.attr("disabled") ? null : "0").html('<span class="current"></span><ul class="list"></ul>'));
            var s = t.next(), n = t.find("option"), i = t.find("option:selected");
            s.find(".current").html(i.data("display") || i.text()), n.each(function (t) {
                var n = e(this), i = n.data("display");
                s.find("ul").append(e("<li></li>").attr("data-value", n.val()).attr("data-display", i || null).addClass("option" + (n.is(":selected") ? " selected" : "") + (n.is(":disabled") ? " disabled" : "")).html(n.text()))
            })
        }

        if ("string" == typeof t) return "update" == t ? this.each(function () {
            var t = e(this), n = e(this).next(".nice-select"), i = n.hasClass("open");
            n.length && (n.remove(), s(t), i && t.next().trigger("click"))
        }) : "destroy" == t ? (this.each(function () {
            var t = e(this), s = e(this).next(".nice-select");
            s.length && (s.remove(), t.css("display", ""))
        }), 0 == e(".nice-select").length && e(document).off(".nice_select")) : console.log('Method "' + t + '" does not exist.'), this;
        this.hide(), this.each(function () {
            var t = e(this);
            t.next().hasClass("nice-select") || s(t)
        }), e(document).off(".nice_select"), e(document).on("click.nice_select", ".nice-select", function (t) {
            var s = e(this);
            e(".nice-select").not(s).removeClass("open"), s.toggleClass("open"), s.hasClass("open") ? (s.find(".option"), s.find(".focus").removeClass("focus"), s.find(".selected").addClass("focus")) : s.focus()
        }), e(document).on("click.nice_select", function (t) {
            0 === e(t.target).closest(".nice-select").length && e(".nice-select").removeClass("open").find(".option")
        }), e(document).on("click.nice_select", ".nice-select .option:not(.disabled)", function (t) {
            var s = e(this), n = s.closest(".nice-select");
            n.find(".selected").removeClass("selected"), s.addClass("selected");
            var i = s.data("display") || s.text();
            n.find(".current").text(i), n.prev("select").val(s.data("value")).trigger("change")
        }), e(document).on("keydown.nice_select", ".nice-select", function (t) {
            var s = e(this), n = e(s.find(".focus") || s.find(".list .option.selected"));
            if (32 == t.keyCode || 13 == t.keyCode) return s.hasClass("open") ? n.trigger("click") : s.trigger("click"), !1;
            if (40 == t.keyCode) {
                if (s.hasClass("open")) {
                    var i = n.nextAll(".option:not(.disabled)").first();
                    i.length > 0 && (s.find(".focus").removeClass("focus"), i.addClass("focus"))
                } else s.trigger("click");
                return !1
            }
            if (38 == t.keyCode) {
                if (s.hasClass("open")) {
                    var l = n.prevAll(".option:not(.disabled)").first();
                    l.length > 0 && (s.find(".focus").removeClass("focus"), l.addClass("focus"))
                } else s.trigger("click");
                return !1
            }
            if (27 == t.keyCode) s.hasClass("open") && s.trigger("click"); else if (9 == t.keyCode && s.hasClass("open")) return !1
        });
        var n = document.createElement("a").style;
        return n.cssText = "pointer-events:auto", "auto" !== n.pointerEvents && e("html").addClass("no-csspointerevents"), this
    }
}(jQuery);


/*========= Youtube Player =========*/
/*! YU2FVL - jQuery Youtube Url To FullScreen Video Lightbox - v0.1.0 - 2016-02-07
* http://otakod.es/yu2fvl
* Copyright (c) 2016 darkylmnx; Licensed MIT */
!function (t, e, s) {
    function i(t) {
        return /youtu\.be/.test(t) ? t.split("youtu.be/")[1].split("?")[0].split("&")[0].split("#")[0] : /youtube\.com\/v\//.test(t) ? t.split("youtube.com/v/")[1].split("?")[0].split("&")[0].split("#")[0] : /youtube\.com\/embed\//.test(t) ? t.split("youtube.com/embed/")[1].split("?")[0].split("&")[0].split("#")[0] : /youtube.com|youtuberepeater.com|listenonrepeat.com/.test(t) ? t.split("v=")[1].split("&")[0].split("#")[0] : !1
    }

    function n(t, e, s) {
        var i = JSON.stringify({event: "command", func: e, args: s || []});
        -1 !== t.src.indexOf("youtube.com/embed") && t.contentWindow.postMessage(i, "*")
    }

    function o(e, i, o) {
        function f() {
            var t = a.width() - e.minPaddingX, s = a.height() - e.minPaddingY, i = t / s, n = e.ratio;
            i > n ? (C.height(s), C.width(s * n)) : (C.width(t), C.height(t / n)), C.css("left", (a.width() - C.width()) / 2), C.css("top", (a.height() - C.height()) / 2)
        }

        function r() {
            n(w[0], "playVideo"), h()
        }

        function h() {
            b.stop().fadeIn("fast"), C.stop().fadeIn("fast")
        }

        function m() {
            b.stop().fadeOut("fast"), C.stop().fadeOut("fast", function () {
                null === i && e.open && (b.remove(), C.remove())
            })
        }

        function v(t) {
            t.on("click", function (t) {
                t.preventDefault(), r()
            })
        }

        function y(t) {
            t.on("click", function (t) {
                t.preventDefault(), n(w[0], "pauseVideo"), m()
            })
        }

        var C = t(s.createElement("DIV")).addClass(e.cssClass).css(c),
            b = t(s.createElement("DIV")).addClass(e.cssClass + e.overlayCssClass).css(p),
            g = t(s.createElement("BUTTON")).addClass(e.cssClass + e.closeCssClass).html(e.closeText),
            w = t(s.createElement("IFRAME")).addClass(e.cssClass + e.iframeCssClass).attr({src: l + o + d}).css(u);
        C.append(w).append(g), t("body").append(b).append(C), e.open && w.on("load", function () {
            r()
        }), null !== i && v(i), y(g.add(b)), a.on("resize", f).trigger("resize")
    }

    var a = t(e), l = "https://www.youtube.com/embed/", d = "?enablejsapi=1", c = {display: "none", position: "fixed"},
        u = {width: "100%", height: "100%"},
        p = {display: "none", position: "fixed", top: 0, left: 0, width: "100%", height: "100%"}, f = {
            minPaddingX: 50,
            minPaddingY: 50,
            ratio: 16 / 9,
            cssClass: "yu2fvl",
            overlayCssClass: "-overlay",
            iframeCssClass: "-iframe",
            closeCssClass: "-close",
            closeText: "X",
            open: !1,
            vid: !1
        };
    t.yu2fvl = function (e) {
        var s = t.extend({}, f, e);
        if (s.vid === !1) throw"YOU MUST SET THE 'vid' option";
        o(s, null, s.vid)
    }, t.fn.yu2fvl = function (e) {
        function s() {
            var e = t(this), s = i(e.attr("href"));
            o(n, e, s)
        }

        var n = t.extend({}, f, e);
        return n.vid !== !1 ? (o(n, this, n.vid), this) : this.each(s)
    }
}(jQuery, window, document);


// Counterup Js


/*========== Odometer ==========*/
/*! odometer 0.4.6 */
(function () {
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G = [].slice;
    q = '<span class="odometer-value"></span>', n = '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' + q + "</span></span>", d = '<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">' + n + "</span></span>", g = '<span class="odometer-formatting-mark"></span>', c = "(,ddd).dd", h = /^\(?([^)]*)\)?(?:(.)(d+))?$/, i = 30, f = 2e3, a = 20, j = 2, e = .5, k = 1e3 / i, b = 1e3 / a, o = "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", y = document.createElement("div").style, p = null != y.transition || null != y.webkitTransition || null != y.mozTransition || null != y.oTransition, w = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, l = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver, s = function (a) {
        var b;
        return b = document.createElement("div"), b.innerHTML = a, b.children[0]
    }, v = function (a, b) {
        return a.className = a.className.replace(new RegExp("(^| )" + b.split(" ").join("|") + "( |$)", "gi"), " ")
    }, r = function (a, b) {
        return v(a, b), a.className += " " + b
    }, z = function (a, b) {
        var c;
        return null != document.createEvent ? (c = document.createEvent("HTMLEvents"), c.initEvent(b, !0, !0), a.dispatchEvent(c)) : void 0
    }, u = function () {
        var a, b;
        return null != (a = null != (b = window.performance) ? "function" == typeof b.now ? b.now() : void 0 : void 0) ? a : +new Date
    }, x = function (a, b) {
        return null == b && (b = 0), b ? (a *= Math.pow(10, b), a += .5, a = Math.floor(a), a /= Math.pow(10, b)) : Math.round(a)
    }, A = function (a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }, t = function (a) {
        return a - x(a)
    }, C = !1, (B = function () {
        var a, b, c, d, e;
        if (!C && null != window.jQuery) {
            for (C = !0, d = ["html", "text"], e = [], b = 0, c = d.length; c > b; b++) a = d[b], e.push(function (a) {
                var b;
                return b = window.jQuery.fn[a], window.jQuery.fn[a] = function (a) {
                    var c;
                    return null == a || null == (null != (c = this[0]) ? c.odometer : void 0) ? b.apply(this, arguments) : this[0].odometer.update(a)
                }
            }(a));
            return e
        }
    })(), setTimeout(B, 0), m = function () {
        function a(b) {
            var c, d, e, g, h, i, l, m, n, o, p = this;
            if (this.options = b, this.el = this.options.el, null != this.el.odometer) return this.el.odometer;
            this.el.odometer = this, m = a.options;
            for (d in m) g = m[d], null == this.options[d] && (this.options[d] = g);
            null == (h = this.options).duration && (h.duration = f), this.MAX_VALUES = this.options.duration / k / j | 0, this.resetFormat(), this.value = this.cleanValue(null != (n = this.options.value) ? n : ""), this.renderInside(), this.render();
            try {
                for (o = ["innerHTML", "innerText", "textContent"], i = 0, l = o.length; l > i; i++) e = o[i], null != this.el[e] && !function (a) {
                    return Object.defineProperty(p.el, a, {
                        get: function () {
                            var b;
                            return "innerHTML" === a ? p.inside.outerHTML : null != (b = p.inside.innerText) ? b : p.inside.textContent
                        }, set: function (a) {
                            return p.update(a)
                        }
                    })
                }(e)
            } catch (q) {
                c = q, this.watchForMutations()
            }
        }

        return a.prototype.renderInside = function () {
            return this.inside = document.createElement("div"), this.inside.className = "odometer-inside", this.el.innerHTML = "", this.el.appendChild(this.inside)
        }, a.prototype.watchForMutations = function () {
            var a, b = this;
            if (null != l) try {
                return null == this.observer && (this.observer = new l(function () {
                    var a;
                    return a = b.el.innerText, b.renderInside(), b.render(b.value), b.update(a)
                })), this.watchMutations = !0, this.startWatchingMutations()
            } catch (c) {
                a = c
            }
        }, a.prototype.startWatchingMutations = function () {
            return this.watchMutations ? this.observer.observe(this.el, {childList: !0}) : void 0
        }, a.prototype.stopWatchingMutations = function () {
            var a;
            return null != (a = this.observer) ? a.disconnect() : void 0
        }, a.prototype.cleanValue = function (a) {
            var b;
            return "string" == typeof a && (a = a.replace(null != (b = this.format.radix) ? b : ".", "<radix>"), a = a.replace(/[.,]/g, ""), a = a.replace("<radix>", "."), a = parseFloat(a, 10) || 0), x(a, this.format.precision)
        }, a.prototype.bindTransitionEnd = function () {
            var a, b, c, d, e, f, g = this;
            if (!this.transitionEndBound) {
                for (this.transitionEndBound = !0, b = !1, e = o.split(" "), f = [], c = 0, d = e.length; d > c; c++) a = e[c], f.push(this.el.addEventListener(a, function () {
                    return b ? !0 : (b = !0, setTimeout(function () {
                        return g.render(), b = !1, z(g.el, "odometerdone")
                    }, 0), !0)
                }, !1));
                return f
            }
        }, a.prototype.resetFormat = function () {
            var a, b, d, e, f, g, i, j;
            if (a = null != (i = this.options.format) ? i : c, a || (a = "d"), d = h.exec(a), !d) throw new Error("Odometer: Unparsable digit format");
            return j = d.slice(1, 4), g = j[0], f = j[1], b = j[2], e = (null != b ? b.length : void 0) || 0, this.format = {
                repeating: g,
                radix: f,
                precision: e
            }
        }, a.prototype.render = function (a) {
            var b, c, d, e, f, g, h, i, j, k, l, m;
            for (null == a && (a = this.value), this.stopWatchingMutations(), this.resetFormat(), this.inside.innerHTML = "", g = this.options.theme, b = this.el.className.split(" "), f = [], i = 0, k = b.length; k > i; i++) c = b[i], c.length && ((e = /^odometer-theme-(.+)$/.exec(c)) ? g = e[1] : /^odometer(-|$)/.test(c) || f.push(c));
            for (f.push("odometer"), p || f.push("odometer-no-transitions"), f.push(g ? "odometer-theme-" + g : "odometer-auto-theme"), this.el.className = f.join(" "), this.ribbons = {}, this.digits = [], h = !this.format.precision || !t(a) || !1, m = a.toString().split("").reverse(), j = 0, l = m.length; l > j; j++) d = m[j], "." === d && (h = !0), this.addDigit(d, h);
            return this.startWatchingMutations()
        }, a.prototype.update = function (a) {
            var b, c = this;
            return a = this.cleanValue(a), (b = a - this.value) ? (v(this.el, "odometer-animating-up odometer-animating-down odometer-animating"), b > 0 ? r(this.el, "odometer-animating-up") : r(this.el, "odometer-animating-down"), this.stopWatchingMutations(), this.animate(a), this.startWatchingMutations(), setTimeout(function () {
                return c.el.offsetHeight, r(c.el, "odometer-animating")
            }, 0), this.value = a) : void 0
        }, a.prototype.renderDigit = function () {
            return s(d)
        }, a.prototype.insertDigit = function (a, b) {
            return null != b ? this.inside.insertBefore(a, b) : this.inside.children.length ? this.inside.insertBefore(a, this.inside.children[0]) : this.inside.appendChild(a)
        }, a.prototype.addSpacer = function (a, b, c) {
            var d;
            return d = s(g), d.innerHTML = a, c && r(d, c), this.insertDigit(d, b)
        }, a.prototype.addDigit = function (a, b) {
            var c, d, e, f;
            if (null == b && (b = !0), "-" === a) return this.addSpacer(a, null, "odometer-negation-mark");
            if ("." === a) return this.addSpacer(null != (f = this.format.radix) ? f : ".", null, "odometer-radix-mark");
            if (b) for (e = !1; ;) {
                if (!this.format.repeating.length) {
                    if (e) throw new Error("Bad odometer format without digits");
                    this.resetFormat(), e = !0
                }
                if (c = this.format.repeating[this.format.repeating.length - 1], this.format.repeating = this.format.repeating.substring(0, this.format.repeating.length - 1), "d" === c) break;
                this.addSpacer(c)
            }
            return d = this.renderDigit(), d.querySelector(".odometer-value").innerHTML = a, this.digits.push(d), this.insertDigit(d)
        }, a.prototype.animate = function (a) {
            return p && "count" !== this.options.animation ? this.animateSlide(a) : this.animateCount(a)
        }, a.prototype.animateCount = function (a) {
            var c, d, e, f, g, h = this;
            if (d = +a - this.value) return f = e = u(), c = this.value, (g = function () {
                var i, j, k;
                return u() - f > h.options.duration ? (h.value = a, h.render(), void z(h.el, "odometerdone")) : (i = u() - e, i > b && (e = u(), k = i / h.options.duration, j = d * k, c += j, h.render(Math.round(c))), null != w ? w(g) : setTimeout(g, b))
            })()
        }, a.prototype.getDigitCount = function () {
            var a, b, c, d, e, f;
            for (d = 1 <= arguments.length ? G.call(arguments, 0) : [], a = e = 0, f = d.length; f > e; a = ++e) c = d[a], d[a] = Math.abs(c);
            return b = Math.max.apply(Math, d), Math.ceil(Math.log(b + 1) / Math.log(10))
        }, a.prototype.getFractionalDigitCount = function () {
            var a, b, c, d, e, f, g;
            for (e = 1 <= arguments.length ? G.call(arguments, 0) : [], b = /^\-?\d*\.(\d*?)0*$/, a = f = 0, g = e.length; g > f; a = ++f) d = e[a], e[a] = d.toString(), c = b.exec(e[a]), e[a] = null == c ? 0 : c[1].length;
            return Math.max.apply(Math, e)
        }, a.prototype.resetDigits = function () {
            return this.digits = [], this.ribbons = [], this.inside.innerHTML = "", this.resetFormat()
        }, a.prototype.animateSlide = function (a) {
            var b, c, d, f, g, h, i, j, k, l, m, n, o, p, q, s, t, u, v, w, x, y, z, B, C, D, E;
            if (s = this.value, j = this.getFractionalDigitCount(s, a), j && (a *= Math.pow(10, j), s *= Math.pow(10, j)), d = a - s) {
                for (this.bindTransitionEnd(), f = this.getDigitCount(s, a), g = [], b = 0, m = v = 0; f >= 0 ? f > v : v > f; m = f >= 0 ? ++v : --v) {
                    if (t = A(s / Math.pow(10, f - m - 1)), i = A(a / Math.pow(10, f - m - 1)), h = i - t, Math.abs(h) > this.MAX_VALUES) {
                        for (l = [], n = h / (this.MAX_VALUES + this.MAX_VALUES * b * e), c = t; h > 0 && i > c || 0 > h && c > i;) l.push(Math.round(c)), c += n;
                        l[l.length - 1] !== i && l.push(i), b++
                    } else l = function () {
                        E = [];
                        for (var a = t; i >= t ? i >= a : a >= i; i >= t ? a++ : a--) E.push(a);
                        return E
                    }.apply(this);
                    for (m = w = 0, y = l.length; y > w; m = ++w) k = l[m], l[m] = Math.abs(k % 10);
                    g.push(l)
                }
                for (this.resetDigits(), D = g.reverse(), m = x = 0, z = D.length; z > x; m = ++x) for (l = D[m], this.digits[m] || this.addDigit(" ", m >= j), null == (u = this.ribbons)[m] && (u[m] = this.digits[m].querySelector(".odometer-ribbon-inner")), this.ribbons[m].innerHTML = "", 0 > d && (l = l.reverse()), o = C = 0, B = l.length; B > C; o = ++C) k = l[o], q = document.createElement("div"), q.className = "odometer-value", q.innerHTML = k, this.ribbons[m].appendChild(q), o === l.length - 1 && r(q, "odometer-last-value"), 0 === o && r(q, "odometer-first-value");
                return 0 > t && this.addDigit("-"), p = this.inside.querySelector(".odometer-radix-mark"), null != p && p.parent.removeChild(p), j ? this.addSpacer(this.format.radix, this.digits[j - 1], "odometer-radix-mark") : void 0
            }
        }, a
    }(), m.options = null != (E = window.odometerOptions) ? E : {}, setTimeout(function () {
        var a, b, c, d, e;
        if (window.odometerOptions) {
            d = window.odometerOptions, e = [];
            for (a in d) b = d[a], e.push(null != (c = m.options)[a] ? (c = m.options)[a] : c[a] = b);
            return e
        }
    }, 0), m.init = function () {
        var a, b, c, d, e, f;
        if (null != document.querySelectorAll) {
            for (b = document.querySelectorAll(m.options.selector || ".odometer"), f = [], c = 0, d = b.length; d > c; c++) a = b[c], f.push(a.odometer = new m({
                el: a,
                value: null != (e = a.innerText) ? e : a.textContent
            }));
            return f
        }
    }, null != (null != (F = document.documentElement) ? F.doScroll : void 0) && null != document.createEventObject ? (D = document.onreadystatechange, document.onreadystatechange = function () {
        return "complete" === document.readyState && m.options.auto !== !1 && m.init(), null != D ? D.apply(this, arguments) : void 0
    }) : document.addEventListener("DOMContentLoaded", function () {
        return m.options.auto !== !1 ? m.init() : void 0
    }, !1), "function" == typeof define && define.amd ? define(["jquery"], function () {
        return m
    }) : typeof exports === !1 ? module.exports = m : window.Odometer = m
}).call(this);


/*! Nestoria Slider - v1.0.13 - 2015-07-16
* http://lokku.github.io/jquery-nstslider/
* Copyright (c) 2015 Lokku Ltd.; Licensed MIT */
!function (a) {
    var b, c, d, e, f, g, h, i, j, k = {
        setNakedBarDelta: function (a, b) {
            if ("stickToSides" === a) j = {toEndWidth: b, toBeginLeft: 0, toBeginWidth: b}; else {
                if ("middle" !== a) throw new Error("unknown position of setNakedBarDelta: " + a);
                j = {toEndWidth: b / 2, toBeginLeft: b / 2, toBeginWidth: b / 2}
            }
        }, getSliderValuesAtPositionPx: function (a, b) {
            var c, d, e = this, f = e.data("pixel_to_value_mapping");
            if ("undefined" != typeof f) c = f(a), d = f(b); else {
                var g = k.getSliderWidthPx.call(e) - e.data("left_grip_width");
                c = k.inverse_rangemap_0_to_n.call(e, a, g), d = k.inverse_rangemap_0_to_n.call(e, b, g)
            }
            return [c, d]
        }, validateAndMoveGripsToPx: function (a, b) {
            var c = this, d = k.getSliderWidthPx.call(c) - c.data("left_grip_width");
            if (d >= b && a >= 0 && d >= a && (!c.data("has_right_grip") || b >= a)) {
                var e = c.data("cur_min"), f = c.data("cur_max");
                k.set_position_from_px.call(c, a, b), k.refresh_grips_style.call(c), k.notify_changed_implicit.call(c, "drag_move", e, f)
            }
            return c
        }, updateAriaAttributes: function () {
            var a = this, b = a.data("settings"), c = a.find(b.left_grip_selector);
            if (a.data("has_right_grip")) {
                var d = a.find(b.right_grip_selector);
                c.attr("aria-valuemin", a.data("range_min")).attr("aria-valuenow", l.get_current_min_value.call(a)).attr("aria-valuemax", l.get_current_max_value.call(a)), d.attr("aria-valuemin", l.get_current_min_value.call(a)).attr("aria-valuenow", l.get_current_max_value.call(a)).attr("aria-valuemax", a.data("range_max"))
            } else c.attr("aria-valuemin", a.data("range_min")).attr("aria-valuenow", l.get_current_min_value.call(a)).attr("aria-valuemax", a.data("range_max"));
            return a
        }, getSliderWidthPx: function () {
            var a = this;
            return Math.round(a.width())
        }, getGripPositionPx: function (a) {
            return parseInt(a.css("left").replace("px", ""), 10)
        }, getLeftGripPositionPx: function () {
            var a = this, b = a.data("settings"), c = a.find(b.left_grip_selector);
            return k.getGripPositionPx.call(a, c)
        }, getRightGripPositionPx: function () {
            var a = this, b = a.data("settings");
            if (a.data("has_right_grip")) return k.getGripPositionPx.call(a, a.find(b.right_grip_selector));
            var c = k.getSliderWidthPx.call(a) - a.data("left_grip_width");
            return k.rangemap_0_to_n.call(a, a.data("cur_max"), c)
        }, getLeftGripWidth: function () {
            var a = this, b = a.data("settings"), c = a.find(b.left_grip_selector);
            return Math.round(c.outerWidth())
        }, getRightGripWidth: function () {
            var a = this, b = a.data("settings"), c = a.find(b.right_grip_selector);
            return Math.round(c.outerWidth())
        }, binarySearchValueToPxCompareFunc: function (b, c, d) {
            return b === c[d] ? 0 : b < c[d] && 0 === d ? 0 : c[d - 1] <= b && b < c[d] ? 0 : b > c[d] ? 1 : b <= c[d - 1] ? -1 : void a.error("cannot compare s: " + b + " with a[" + d + "]. a is: " + c.join(","))
        }, binarySearch: function (a, b, c, d) {
            for (var e, f, g = 0, h = a.length - 1; h >= g;) {
                e = (g + h) / 2 | 0, f = c(a, e);
                var i = d(b, a, e);
                if (i > 0) g = e + 1; else {
                    if (!(0 > i)) return e;
                    h = e - 1
                }
            }
            return -1
        }, haveLimits: function () {
            var a = this, b = a.data("lower-limit"), c = a.data("upper-limit"), d = !1;
            return "undefined" != typeof b && "undefined" != typeof c && (d = !0), d
        }, refresh_grips_style: function () {
            var a = this, b = a.data("settings");
            if ("undefined" != typeof b.highlight) {
                var c = a.data("highlightedRangeMin");
                if ("undefined" != typeof c) {
                    var d = a.find(b.left_grip_selector), e = a.find(b.right_grip_selector),
                        f = a.data("highlightedRangeMax"), g = a.data("cur_min"), h = a.data("cur_max"),
                        i = b.highlight.grip_class;
                    c > g || g > f ? d.removeClass(i) : d.addClass(i), c > h || h > f ? e.removeClass(i) : e.addClass(i)
                }
            }
        }, set_position_from_val: function (a, b) {
            var c = this, d = c.data("range_min"), e = c.data("range_max");
            d > a && (a = d), a > e && (a = e), c.data("has_right_grip") ? (b > e && (b = e), d > b && (b = d)) : b = c.data("cur_max");
            var f = l.value_to_px.call(c, a), g = l.value_to_px.call(c, b);
            return k.set_handles_at_px.call(c, f, g), c.data("cur_min", a), c.data("has_right_grip") && c.data("cur_max", b), c
        }, set_position_from_px: function (a, b) {
            var c = this;
            k.set_handles_at_px.call(c, a, b);
            var d = k.getSliderValuesAtPositionPx.call(c, a, b), e = d[0], f = d[1];
            return c.data("cur_min", e), c.data("has_right_grip") && c.data("cur_max", f), c
        }, set_handles_at_px: function (a, b) {
            var c = this, d = c.data("settings"), e = d.left_grip_selector, f = d.right_grip_selector,
                g = d.value_bar_selector, h = c.data("left_grip_width");
            return c.find(e).css("left", a + "px"), c.find(f).css("left", b + "px"), c.data("has_right_grip") ? c.find(g).css("left", a + "px").css("width", b - a + h + "px") : (j || k.populateNakedBarDeltas.call(c, a, b, h), b > a ? c.find(g).css("left", a + "px").css("width", b - a + j.toEndWidth + "px") : c.find(g).css("left", b + j.toBeginLeft + "px").css("width", a - b + j.toBeginWidth + "px")), c
        }, drag_start_func_touch: function (a, b, c, e, f) {
            var g = this, h = a.originalEvent, i = h.touches[0], j = i.pageY, l = i.pageX,
                m = Math.abs(g.offset().top - j), n = g.offset().left, o = n - l, p = l - (n + g.width());
            m > b.touch_tolerance_value_bar_y || o > b.touch_tolerance_value_bar_x || p > b.touch_tolerance_value_bar_x || (h.preventDefault(), d = i.pageX, k.drag_start_func.call(g, i, b, c, e, f))
        }, drag_start_func: function (d, f, g, h, i) {
            var j = this;
            if (j.find(f.left_grip_selector + "," + f.value_bar_selector + "," + f.right_grip_selector).removeClass(f.animating_css_class), l.is_enabled.call(j)) {
                var m = a(d.target), n = !1;
                if ("object" == typeof f.highlight && (n = m.is(f.highlight.panel_selector)), i !== !1 || m.is(f.left_grip_selector) || m.is(f.right_grip_selector) || m.is(f.value_bar_selector) || n || m.is(j)) {
                    b = j;
                    var o, p, q, r, s, t, u = k.getGripPositionPx.call(j, g),
                        v = k.getSliderWidthPx.call(j) - j.data("left_grip_width"), w = g.offset().left,
                        x = k.getRightGripPositionPx.call(j);
                    p = Math.round(d.pageX) - j.data("left_grip_width") / 2, q = Math.abs(w - p), s = p - w, j.data("has_right_grip") ? (o = h.offset().left, r = Math.abs(o - p), t = p - o) : (r = 2 * q, t = 2 * s), f.user_drag_start_callback.call(j, d), q === r ? w > p ? (u += s, e = !0) : (x += t, e = !1) : r > q ? (u += s, e = !0) : (x += t, e = !1), j.data("has_right_grip") ? x > v && (x = v) : u > v && (u = v), 0 > u && (u = 0), c = !0;
                    var y = j.data("cur_min"), z = j.data("cur_max");
                    k.set_position_from_px.call(j, u, x), k.refresh_grips_style.call(j), k.notify_changed_implicit.call(j, "drag_start", y, z), "[object Touch]" !== Object.prototype.toString.apply(d) && d.preventDefault()
                }
            }
        }, drag_move_func_touch: function (a) {
            if (c === !0) {
                var b = a.originalEvent;
                b.preventDefault();
                var d = b.touches[0];
                k.drag_move_func(d)
            }
        }, drag_move_func: function (a) {
            if (c) {
                var f = b, g = f.data("settings"), h = k.getSliderWidthPx.call(f) - f.data("left_grip_width"),
                    i = k.getLeftGripPositionPx.call(f), j = k.getRightGripPositionPx.call(f), l = Math.round(a.pageX),
                    m = l - d, n = f.data("left_grip_width") / 2, o = f.offset().left + f.data("left_grip_width") - n,
                    p = o + h;
                g.crossable_handles === !1 && f.data("has_right_grip") && (e ? p = o + j : o += i);
                var q = 0, r = 0;
                o > l && (q = 1, r = 0), l > p && (r = 1, q = 0), g.crossable_handles === !0 && f.data("has_right_grip") && (e ? h >= j && i + m > j && (e = !1, i = j) : i >= 0 && i > j + m && (e = !0, j = i));
                var s = i, t = j;
                (m > 0 && !q || 0 > m && !r) && (e ? s += m : t += m), k.validateAndMoveGripsToPx.call(f, s, t), d = l, "[object Touch]" !== Object.prototype.toString.apply(a) && a.preventDefault()
            }
        }, drag_end_func_touch: function (a) {
            var b = a.originalEvent;
            b.preventDefault();
            var c = b.touches[0];
            k.drag_end_func(c)
        }, drag_end_func: function () {
            var a = b;
            if ("undefined" != typeof a) {
                c = !1, d = void 0, k.notify_mouse_up_implicit.call(a, e), b = void 0;
                var f = a.data("settings");
                a.find(f.left_grip_selector + "," + f.value_bar_selector + "," + f.right_grip_selector).addClass(f.animating_css_class)
            }
        }, get_rounding_for_value: function (a) {
            var b = this, c = b.data("rounding"), d = b.data("rounding_ranges");
            if ("object" == typeof d) {
                var e = k.binarySearch.call(b, d, a, function (a, b) {
                    return a[b].range
                }, function (a, b, c) {
                    return a < b[c].range ? c > 0 ? a >= b[c - 1].range ? 0 : -1 : 0 : 1
                });
                if (c = 1, e > -1) c = parseInt(d[e].value, 10); else {
                    var f = d.length - 1;
                    a >= d[f].range && (c = d[f].value)
                }
            }
            return c
        }, notify_mouse_up_implicit: function (a) {
            var b = this, c = l.get_current_min_value.call(b), d = l.get_current_max_value.call(b), e = !1;
            (b.data("beforestart_min") !== c || b.data("beforestart_max") !== d) && (e = !0, b.data("beforestart_min", c), b.data("beforestart_max", d));
            var f = b.data("settings");
            return f.user_mouseup_callback.call(b, l.get_current_min_value.call(b), l.get_current_max_value.call(b), a, e), b
        }, notify_changed_implicit: function (a, b, c) {
            var d = this, e = !1;
            ("init" === a || "refresh" === a) && (e = !0);
            var f = l.get_current_min_value.call(d), g = l.get_current_max_value.call(d);
            return e || (b = l.round_value_according_to_rounding.call(d, b), c = l.round_value_according_to_rounding.call(d, c)), (e || f !== b || g !== c) && (k.notify_changed_explicit.call(d, a, b, c, f, g), e = 1), e
        }, notify_changed_explicit: function (a, b, c, d, e) {
            var f = this, g = f.data("settings");
            return f.data("aria_enabled") && k.updateAriaAttributes.call(f), g.value_changed_callback.call(f, a, d, e, b, c), f
        }, validate_params: function (b) {
            var c = this, d = c.data("range_min"), e = c.data("range_max"), f = c.data("cur_min"),
                g = c.data("lower-limit"), h = c.data("upper-limit"), i = k.haveLimits.call(c);
            "undefined" == typeof d && a.error("the data-range_min attribute was not defined"), "undefined" == typeof e && a.error("the data-range_max attribute was not defined"), "undefined" == typeof f && a.error("the data-cur_min attribute must be defined"), d > e && a.error("Invalid input parameter. must be min < max"), i && g > h && a.error("Invalid data-lower-limit or data-upper-limit"), 0 === c.find(b.left_grip_selector).length && a.error("Cannot find element pointed by left_grip_selector: " + b.left_grip_selector), "undefined" != typeof b.right_grip_selector && 0 === c.find(b.right_grip_selector).length && a.error("Cannot find element pointed by right_grip_selector: " + b.right_grip_selector), "undefined" != typeof b.value_bar_selector && 0 === c.find(b.value_bar_selector).length && a.error("Cannot find element pointed by value_bar_selector" + b.value_bar_selector)
        }, rangemap_0_to_n: function (a, b) {
            var c = this, d = c.data("range_min"), e = c.data("range_max");
            return d >= a ? 0 : a >= e ? b : Math.floor((b * a - b * d) / (e - d))
        }, inverse_rangemap_0_to_n: function (a, b) {
            var c = this, d = c.data("range_min"), e = c.data("range_max");
            if (0 >= a) return d;
            if (a >= b) return e;
            var f = (e - d) * a / b;
            return f + d
        }
    }, l = {
        teardown: function () {
            var b = this;
            return b.removeData(), a(document).unbind("mousemove.nstSlider").unbind("mouseup.nstSlider"), b.parent().unbind("mousedown.nstSlider").unbind("touchstart.nstSlider").unbind("touchmove.nstSlider").unbind("touchend.nstSlider"), b.unbind("keydown.nstSlider").unbind("keyup.nstSlider"), b
        }, init: function (b) {
            var c = a.extend({
                animating_css_class: "nst-animating",
                touch_tolerance_value_bar_y: 30,
                touch_tolerance_value_bar_x: 15,
                left_grip_selector: ".nst-slider-grip-left",
                right_grip_selector: void 0,
                highlight: void 0,
                rounding: void 0,
                value_bar_selector: void 0,
                crossable_handles: !0,
                value_changed_callback: function () {
                },
                user_mouseup_callback: function () {
                },
                user_drag_start_callback: function () {
                }
            }, b), d = a(document);
            return d.unbind("mouseup.nstSlider"), d.unbind("mousemove.nstSlider"), d.bind("mousemove.nstSlider", k.drag_move_func), d.bind("mouseup.nstSlider", k.drag_end_func), this.each(function () {
                var b = a(this), d = b.parent();
                b.data("enabled", !0);
                var j = b.data("range_min"), m = b.data("range_max"), n = b.data("cur_min"), o = b.data("cur_max");
                "undefined" == typeof o && (o = n), "" === j && (j = 0), "" === m && (m = 0), "" === n && (n = 0), "" === o && (o = 0), b.data("range_min", j), b.data("range_max", m), b.data("cur_min", n), b.data("cur_max", o), k.validate_params.call(b, c), b.data("settings", c), "undefined" != typeof c.rounding ? l.set_rounding.call(b, c.rounding) : "undefined" != typeof b.data("rounding") ? l.set_rounding.call(b, b.data("rounding")) : l.set_rounding.call(b, 1);
                var p = b.find(c.left_grip_selector)[0], q = a(p), r = a(b.find(c.right_grip_selector)[0]);
                "undefined" == typeof q.attr("tabindex") && q.attr("tabindex", 0);
                var s = !1;
                b.find(c.right_grip_selector).length > 0 && (s = !0, "undefined" == typeof r.attr("tabindex") && r.attr("tabindex", 0)), b.data("has_right_grip", s), b.data("aria_enabled") === !0 && (q.attr("role", "slider").attr("aria-disabled", "false"), s && r.attr("role", "slider").attr("aria-disabled", "false")), b.bind("keyup.nstSlider", function (a) {
                    if (b.data("enabled")) {
                        switch (a.which) {
                            case 37:
                            case 38:
                            case 39:
                            case 40:
                                if (f === h) {
                                    var c, d, j, m = k.getSliderWidthPx.call(b);
                                    if (0 > g - i) {
                                        for (d = i; m >= d; d++) if (c = l.round_value_according_to_rounding.call(b, k.getSliderValuesAtPositionPx.call(b, d, d)[1]), c !== h) {
                                            j = d;
                                            break
                                        }
                                    } else for (d = i; d >= 0; d--) if (c = l.round_value_according_to_rounding.call(b, k.getSliderValuesAtPositionPx.call(b, d, d)[1]), c !== h) {
                                        j = d;
                                        break
                                    }
                                    e ? k.validateAndMoveGripsToPx.call(b, j, k.getRightGripPositionPx.call(b)) : k.validateAndMoveGripsToPx.call(b, k.getLeftGripPositionPx.call(b), j), k.notify_mouse_up_implicit.call(b, e)
                                }
                        }
                        f = void 0, g = void 0, h = void 0, i = void 0
                    }
                }), b.bind("keydown.nstSlider", function (a) {
                    if (b.data("enabled")) {
                        var c = function (a, c) {
                            var d = k.getLeftGripPositionPx.call(b), j = k.getRightGripPositionPx.call(b);
                            switch ("undefined" == typeof f && (g = e ? d : j, f = e ? l.get_current_min_value.call(b) : l.get_current_max_value.call(b)), c.which) {
                                case 37:
                                case 40:
                                    e ? d-- : j--, c.preventDefault();
                                    break;
                                case 38:
                                case 39:
                                    e ? d++ : j++, c.preventDefault()
                            }
                            i = e ? d : j, k.validateAndMoveGripsToPx.call(b, d, j), h = e ? l.get_current_min_value.call(b) : l.get_current_max_value.call(b)
                        };
                        s && b.find(":focus").is(r) ? (e = !1, c.call(b, r, a)) : (e = !0, c.call(b, q, a))
                    }
                });
                var t = k.getLeftGripWidth.call(b), u = s ? k.getRightGripWidth.call(b) : t;
                if (b.data("left_grip_width", t), b.data("right_grip_width", u), b.data("value_bar_selector", c.value_bar_selector), !s) {
                    var v = o === m || o === j;
                    k.setNakedBarDelta.call(b, v ? "stickToSides" : "middle", t)
                }
                j === m || n === o ? l.set_range.call(b, j, m) : k.set_position_from_val.call(b, b.data("cur_min"), b.data("cur_max")), k.notify_changed_implicit.call(b, "init"), b.data("beforestart_min", l.get_current_min_value.call(b)), b.data("beforestart_max", l.get_current_max_value.call(b)), b.bind("mousedown.nstSlider", function (a) {
                    k.drag_start_func.call(b, a, c, q, r, !1)
                }), d.bind("touchstart.nstSlider", function (a) {
                    k.drag_start_func_touch.call(b, a, c, q, r, !0)
                }), d.bind("touchend.nstSlider", function (a) {
                    k.drag_end_func_touch.call(b, a)
                }), d.bind("touchmove.nstSlider", function (a) {
                    k.drag_move_func_touch.call(b, a)
                });
                var w = b.data("histogram");
                "undefined" != typeof w && l.set_step_histogram.call(b, w)
            })
        }, get_range_min: function () {
            var a = this;
            return a.data("range_min")
        }, get_range_max: function () {
            var a = this;
            return a.data("range_max")
        }, get_current_min_value: function () {
            var b, c = a(this), d = l.get_range_min.call(c), e = l.get_range_max.call(c), f = c.data("cur_min");
            if (b = d >= f ? d : l.round_value_according_to_rounding.call(c, f), k.haveLimits.call(c)) {
                if (d >= b) return c.data("lower-limit");
                if (b >= e) return c.data("upper-limit")
            } else {
                if (d >= b) return d;
                if (b >= e) return e
            }
            return b
        }, get_current_max_value: function () {
            var b, c = a(this), d = l.get_range_min.call(c), e = l.get_range_max.call(c), f = c.data("cur_max");
            if (b = f >= e ? e : l.round_value_according_to_rounding.call(c, f), k.haveLimits.call(c)) {
                if (b >= e) return c.data("upper-limit");
                if (d >= b) return c.data("lower-limit")
            } else {
                if (b >= e) return e;
                if (d >= b) return d
            }
            return b
        }, is_handle_to_left_extreme: function () {
            var a = this;
            return k.haveLimits.call(a) ? a.data("lower-limit") === l.get_current_min_value.call(a) : l.get_range_min.call(a) === l.get_current_min_value.call(a)
        }, is_handle_to_right_extreme: function () {
            var a = this;
            return k.haveLimits.call(a) ? a.data("upper-limit") === l.get_current_max_value.call(a) : l.get_range_max.call(a) === l.get_current_max_value.call(a)
        }, refresh: function () {
            var a = this, b = a.data("last_step_histogram");
            "undefined" != typeof b && l.set_step_histogram.call(a, b), k.set_position_from_val.call(a, l.get_current_min_value.call(a), l.get_current_max_value.call(a));
            var c = a.data("highlightedRangeMin");
            if ("number" == typeof c) {
                var d = a.data("highlightedRangeMax");
                l.highlight_range.call(a, c, d)
            }
            return k.notify_changed_implicit.call(a, "refresh"), a
        }, disable: function () {
            var a = this, b = a.data("settings");
            return a.data("enabled", !1).find(b.left_grip_selector).attr("aria-disabled", "true").end().find(b.right_grip_selector).attr("aria-disabled", "true"), a
        }, enable: function () {
            var a = this, b = a.data("settings");
            return a.data("enabled", !0).find(b.left_grip_selector).attr("aria-disabled", "false").end().find(b.right_grip_selector).attr("aria-disabled", "false"), a
        }, is_enabled: function () {
            var a = this;
            return a.data("enabled")
        }, set_position: function (a, b) {
            var c = this, d = c.data("cur_min"), e = c.data("cur_max");
            a > b ? k.set_position_from_val.call(c, b, a) : k.set_position_from_val.call(c, a, b), k.refresh_grips_style.call(c), k.notify_changed_implicit.call(c, "set_position", d, e), c.data("beforestart_min", a), c.data("beforestart_max", b)
        }, set_step_histogram: function (b) {
            var c = this;
            c.data("last_step_histogram", b), "undefined" == typeof b && (a.error("got an undefined histogram in set_step_histogram"), k.unset_step_histogram.call(c));
            var d = k.getSliderWidthPx.call(c) - c.data("left_grip_width"), e = b.length;
            if (!(0 >= d)) {
                var f, g = 0;
                for (f = 0; e > f; f++) g += b[f];
                if (0 === g) return l.unset_step_histogram.call(c), c;
                var h = parseFloat(g) / d;
                for (f = 0; e > f; f++) b[f] = b[f] / h;
                var i = [b[0]];
                for (f = 1; e > f; f++) {
                    var j = i[f - 1] + b[f];
                    i.push(j)
                }
                i.push(d);
                for (var m = [c.data("range_min")], n = 0, o = m[0], p = 0; d >= n;) {
                    var q = parseInt(i.shift(), 10), r = k.inverse_rangemap_0_to_n.call(c, p + 1, e + 1);
                    p++;
                    var s = q - n, t = r - o;
                    for (f = n; q > f; f++) {
                        var u = o + t * (f - n + 1) / s;
                        m.push(u), n++, o = u
                    }
                    if (n === d) break
                }
                m[m.length - 1] = c.data("range_max");
                var v = function (a) {
                    return m[parseInt(a, 10)]
                }, w = function (a) {
                    var b = k.binarySearch.call(c, m, a, function (a, b) {
                        return a[b]
                    }, k.binarySearchValueToPxCompareFunc);
                    return m[b] === a ? b : Math.abs(m[b - 1] - a) < Math.abs(m[b] - a) ? b - 1 : b
                };
                return c.data("pixel_to_value_mapping", v), c.data("value_to_pixel_mapping", w), c
            }
        }, unset_step_histogram: function () {
            var a = this;
            return a.removeData("pixel_to_value_mapping"), a.removeData("value_to_pixel_mapping"), a.removeData("last_step_histogram"), a
        }, set_range: function (a, b) {
            var c = this, d = l.get_current_min_value.call(c), e = l.get_current_max_value.call(c);
            return c.data("range_min", a), c.data("range_max", b), k.set_position_from_val.call(c, d, e), k.notify_changed_implicit.call(c, "set_range", d, e), c
        }, highlight_range: function (b, c) {
            var d = this, e = d.data("settings");
            "undefined" == typeof e.highlight && a.error('you cannot call highlight_range if you haven\' specified the "highlight" parameter in construction!'), b || (b = 0), c || (c = 0);
            var f = l.value_to_px.call(d, b), g = l.value_to_px.call(d, c), h = g - f + d.data("left_grip_width"),
                i = d.find(e.highlight.panel_selector);
            return i.css("left", f + "px"), i.css("width", h + "px"), d.data("highlightedRangeMin", b), d.data("highlightedRangeMax", c), k.refresh_grips_style.call(d), d
        }, set_rounding: function (b) {
            var c = this;
            "string" == typeof b && b.indexOf("{") > -1 && (b = a.parseJSON(b)), c.data("rounding", b);
            var d = [];
            if ("object" == typeof b) {
                var e;
                for (e in b) if (b.hasOwnProperty(e)) {
                    var f = b[e];
                    d.push({range: f, value: e})
                }
                d.sort(function (a, b) {
                    return a.range - b.range
                }), c.data("rounding_ranges", d)
            } else c.removeData("rounding_ranges");
            return c
        }, get_rounding: function () {
            var a = this;
            return a.data("rounding")
        }, round_value_according_to_rounding: function (b) {
            var c = this, d = k.get_rounding_for_value.call(c, b);
            if (d > 0) {
                var e = b / d, f = parseInt(e, 10), g = e - f;
                g > .5 && f++;
                var h = f * d;
                return h
            }
            return a.error("rounding must be > 0, got " + d + " instead"), b
        }, value_to_px: function (a) {
            var b = this, c = b.data("value_to_pixel_mapping");
            if ("undefined" != typeof c) return c(a);
            var d = k.getSliderWidthPx.call(b) - b.data("left_grip_width");
            return k.rangemap_0_to_n.call(b, a, d)
        }
    }, m = "nstSlider";
    a.fn[m] = function (b) {
        if (l[b]) {
            if (this.data("initialized") === !0) return l[b].apply(this, Array.prototype.slice.call(arguments, 1));
            throw new Error("method " + b + " called on an uninitialized instance of " + m)
        }
        return "object" != typeof b && b ? void a.error("Cannot call method " + b) : (this.data("initialized", !0), l.init.apply(this, arguments))
    }
}(jQuery);


/*================= Contact Form ================*/

$(function () {

    // Get the form.
    var form = $('#contact-form');

    // Get the messages div.
    var formMessages = $('.form-messege');

    // Set up an event listener for the contact form.
    $(form).submit(function (e) {
        // Stop the browser from submitting the form.
        e.preventDefault();

        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
            .done(function (response) {
                // Make sure that the formMessages div has the 'success' class.
                $(formMessages).removeClass('error');
                $(formMessages).addClass('success');

                // Set the message text.
                $(formMessages).text(response);

                // Clear the form.
                $('#contact-form input,#contact-form textarea').val('');
            })
            .fail(function (data) {
                // Make sure that the formMessages div has the 'error' class.
                $(formMessages).removeClass('success');
                $(formMessages).addClass('error');

                // Set the message text.
                if (data.responseText !== '') {
                    $(formMessages).text(data.responseText);
                } else {
                    $(formMessages).text('Oops! An error occured and your message could not be sent.');
                }
            });
    });

});


/*========== ScrollUp ==========*/
/*!
 * scrollup v2.4.1
 * Url: http://markgoodyear.com/labs/scrollup/
 * Copyright (c) Mark Goodyear â€” @markgdyr â€” http://markgoodyear.com
 * License: MIT
 */
!function (l, o, e) {
    "use strict";
    l.fn.scrollUp = function (o) {
        l.data(e.body, "scrollUp") || (l.data(e.body, "scrollUp", !0), l.fn.scrollUp.init(o))
    }, l.fn.scrollUp.init = function (r) {
        var s, t, c, i, n, a, d, p = l.fn.scrollUp.settings = l.extend({}, l.fn.scrollUp.defaults, r), f = !1;
        switch (d = p.scrollTrigger ? l(p.scrollTrigger) : l("<a/>", {
            id: p.scrollName,
            href: "#top"
        }), p.scrollTitle && d.attr("title", p.scrollTitle), d.appendTo("body"), p.scrollImg || p.scrollTrigger || d.html(p.scrollText), d.css({
            display: "none",
            position: "fixed",
            zIndex: p.zIndex
        }), p.activeOverlay && l("<div/>", {id: p.scrollName + "-active"}).css({
            position: "absolute",
            top: p.scrollDistance + "px",
            width: "100%",
            borderTop: "1px dotted" + p.activeOverlay,
            zIndex: p.zIndex
        }).appendTo("body"), p.animation) {
            case"fade":
                s = "fadeIn", t = "fadeOut", c = p.animationSpeed;
                break;
            case"slide":
                s = "slideDown", t = "slideUp", c = p.animationSpeed;
                break;
            default:
                s = "show", t = "hide", c = 0
        }
        i = "top" === p.scrollFrom ? p.scrollDistance : l(e).height() - l(o).height() - p.scrollDistance, n = l(o).scroll(function () {
            l(o).scrollTop() > i ? f || (d[s](c), f = !0) : f && (d[t](c), f = !1)
        }), p.scrollTarget ? "number" == typeof p.scrollTarget ? a = p.scrollTarget : "string" == typeof p.scrollTarget && (a = Math.floor(l(p.scrollTarget).offset().top)) : a = 0, d.click(function (o) {
            o.preventDefault(), l("html, body").animate({scrollTop: a}, p.scrollSpeed, p.easingType)
        })
    }, l.fn.scrollUp.defaults = {
        scrollName: "scrollUp",
        scrollDistance: 300,
        scrollFrom: "top",
        scrollSpeed: 300,
        easingType: "linear",
        animation: "fade",
        animationSpeed: 200,
        scrollTrigger: !1,
        scrollTarget: !1,
        scrollText: "Scroll to top",
        scrollTitle: !1,
        scrollImg: !1,
        activeOverlay: !1,
        zIndex: 2147483647
    }, l.fn.scrollUp.destroy = function (r) {
        l.removeData(e.body, "scrollUp"), l("#" + l.fn.scrollUp.settings.scrollName).remove(), l("#" + l.fn.scrollUp.settings.scrollName + "-active").remove(), l.fn.jquery.split(".")[1] >= 7 ? l(o).off("scroll", r) : l(o).unbind("scroll", r)
    }, l.scrollUp = l.fn.scrollUp
}(jQuery, window, document);













