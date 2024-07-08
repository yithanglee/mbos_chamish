var route_names = [
    { html: "landing.html", title: "Home", route: "/home", },
    { html: "contact.html", title: "Contact", route: "/contact", },

    { html: "single-product.html", title: "Product", route: "/single-product/:id", },
    { html: "not_found.html", title: "Not Found", route: "/not-found" },
], evalTitle = (title) => {
    return title
},
    loadingPage = async () => {
        $(".preloader").removeClass("d-none")
        setTimeout(() => {
            $(".preloader").addClass("d-none")
        }, 1000)
    },
    navigateTo = (route, additionalParamString) => {
        PhxApp.show()
        if (route == null) {
            route = window.location.pathname
        }
        var current_pattern = route.split("/").filter((v, i) => {
            return v != "";
        })
        console.log(current_pattern)
        var match_1 = route_names.filter((rroute, i) => {
            var z = rroute.route.split("/").filter((v, i) => {
                return v != "";
            })
            console.log(z[z.length - 1])
            if (z[z.length - 1].includes(":")) {
                return z.length == current_pattern.length
            } else {
                return z.length == current_pattern.length && z[z.length - 1] == current_pattern[z.length - 1];
            }
        })

        var match_2 =
            match_1.filter((rroute, i) => {
                console.log(rroute)
                var z = rroute.route.split("/").filter((v, i) => {
                    return v != "";
                })
                return z[0] == current_pattern[0]
            })

        if (match_2.length > 0) {

            var params = {}
            match_2.forEach((rroute, i) => {
                var z = rroute.route.split("/").forEach((v, ii) => {
                    if (v.includes(":")) {
                        params[v.replace(":", "")] = current_pattern[ii - 1]
                    }
                })
            })
            console.log("params here")
            console.log(params)
            window.pageParams = params
            var xParamString = ""
            if (additionalParamString == null) {
                xParamString = ""
            } else {
                xParamString = additionalParamString
            }

            if (window.back) {
                window.back = false
            } else {
                var stateObj = { fn: `navigateTo('` + route + `', '` + xParamString + `')`, params: params };
                console.log("xparams")
                console.log(xParamString)
                console.log("route")
                console.log(route)
                window.stateObj = stateObj
                window.matchTitle = match_2[0].title
                window.matchRoute = route


                if (Object.keys(params).includes("title")) {
                    $("title").html(evalTitle(params.title))

                    history.pushState(stateObj, evalTitle(params.title), route);
                } else {
                    $("title").html(evalTitle(match_2[0].title))

                    history.pushState(stateObj, evalTitle(match_2[0].title), route);
                }
            }
            var footer_modals = PhxApp.html("footer_modals.html")
            var html = PhxApp.html2(match_2[0].html, pageParams)
            var initPage = `
          ` + html + `     
          ` + footer_modals + `
            `
            var keys = Object.keys(match_2[0])

            if (keys.includes("skipNav")) {

                $("#wrapper").html(initPage)
                navigateCallback()

            } else {
                var nav = PhxApp.html("blog_nav.html")

                if (keys.includes("customNav")) {
                    var nav = PhxApp.html(match_2[0].customNav)
                }


                $("#wrapper").html(nav)
                $("#wrapper").append(initPage)
                navigateCallback()
            }
            return match_2[0]
        } else {
            var nav = PhxApp.html("blog_nav.html")
            var footer_modals = PhxApp.html("footer_modals.html")
            var html = PhxApp.html("landing.html")
            var initPage =  `
                            `+ nav + `
                            ` + html + `
                            ` + footer_modals + ``
            $("#wrapper").html(initPage)
            navigateCallback()

        }
    }

async function navigateCallback() {
    try {
        $("body")[0].scrollIntoView();
        const navTrigger = document.querySelector('.mobile-toggle'),
            navMenu = document.querySelector('.mainmenu_nav');
        const openNav = function openNav() {
            navTrigger.classList.add('active');
            navMenu.classList.add('active')
        }
        const closeNav = function closeNav() {
            navTrigger.classList.remove('active');
            navMenu.classList.remove('active')
        }
        navTrigger.addEventListener('click', function () {
            if (navTrigger.classList.contains('active')) {
                closeNav()
            } else {
                openNav()
            }
        })
        $('.slide_active').slick({
            dots: true,
            infinite: true,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            slidesToShow: 1,
            slidesToScroll: 1,
        });
        setTimeout(() => {
        }, 1000)
    } catch (E) {
    }
}

$(document).on("click", "a.navi", function (event) {
    event.preventDefault();
    loadingPage()
    $("a.ms-link").removeClass("active")
    $(this)[0].classList.contains("ms-link") ? $(this)[0].classList.add("active") : null;
    setTimeout(() => {
        if ($(this).attr("href").includes("#")) { } else {
            navigateTo($(this).attr("href"))
        }
    }, 200)

});

$(document).ready(() => {
  
    
})