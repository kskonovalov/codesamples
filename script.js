/**
 * MODAL WINDOW
 */
// Get the modal
var i,
    modal,
    modals = document.getElementsByClassName('modal'),
    btns = document.getElementsByClassName("show-form"),
    close = document.getElementsByClassName("close");

// When the user clicks on the button with class "show-form",
// open the modal, default or defined in data-form attr
for (i = 0; i < btns.length; i++) {
    btns[i].onclick = function () {
        if (this.hasAttribute("data-form")) {
            modal = document.getElementById(this.getAttribute("data-form"));
        } else {
            modal = document.getElementById('contact-modal');
        }
        if (modal !== null) {
            modal.style.display = "block";
            document.getElementsByTagName("body")[0].style.overflow = "hidden";
        }
    };
}
// When the user clicks on <span> (x), close the modal
for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
        for (var i = 0; i < modals.length; i++) {
            modals[i].style.display = "none";
        }
        document.getElementsByTagName("body")[0].style.overflow = "visible";
    };
}
// or when the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        for (i = 0; i < modals.length; i++) {
            modals[i].style.display = "none";
        }
        document.getElementsByTagName("body")[0].style.overflow = "visible";
    }
};

/**
 * Submit form with ajax
 * There could be few forms on page, form prefix generated with backend passes here as param
 * <form .. onsubmit="event.preventDefault(); sendForm({{ formPrefix }});"
 * @param formId
 */
function sendForm(formId) {
    document.getElementById("btn-send-contact" + formId).disabled = true;
    var http = new XMLHttpRequest();
    var url = "/";
    var form = document.getElementById("form" + formId);
    var fromName = form.querySelector("[name='fromName']").value;
    var secondName = "";
    var params =
        "CRAFT_CSRF_TOKEN=" + form.querySelector("[name='CRAFT_CSRF_TOKEN']").value
        + "&action=" + form.querySelector("[name='action']").value
        + "&fromName=" + fromName
        + "&phone=" + form.querySelector("[name='phone']").value;
    if (form.querySelector("[name='fromEmail']")) {
        params += "&fromEmail=" + form.querySelector("[name='fromEmail']").value;
    }
    if (form.querySelector("[name='msg']")) {
        params += "&msg=" + form.querySelector("[name='msg']").value;
    }
    if (form.querySelector("[name='secondName']")) {
        secondName = form.querySelector("[name='secondName']").value;
        params += "&secondName=" + secondName;
    }
    if (form.querySelector("[name='formname']")) {
        var formname = form.querySelector("[name='formname']").value;
        params += "&formname=" + formname;
    }
    if (form.querySelectorAll("[name^='messageFields[']")) {
        form.querySelectorAll("[name^='messageFields[']").forEach(function (el) {
            params += "&" + el.getAttribute("name") + "=" + el.value;
        });
    }
    params += "&source=" + window.location.href;
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    //Send the proper header information along with the request
    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            var result = JSON.parse(http.responseText);
            var res = "";
            for (i in result.error) {
                res = res + "<li>" + result.error[i] + "</li>";
            }
            if (res.length == 0) {
                document.getElementById("resultMessage" + formId).classList.add('success');
                document.getElementById("resultMessage" + formId).classList.remove('error');
                res = "Bedankt voor uw bericht";
                if (fromName.length) {
                    res = res + ", " + fromName;
                }
                if (secondName.length) {
                    res = res + " " + secondName;
                }
                res = res + "!";
                res = res + " Redirecting..";
                form.querySelector("[name='fromName']").value = "";
                form.querySelector("[name='phone']").value = "";
                if (form.querySelector("[name='fromEmail']")) {
                    form.querySelector("[name='fromEmail']").value = "";
                }
                if (form.querySelector("[name='msg']")) {
                    form.querySelector("[name='msg']").value = "";
                }
                if (form.querySelector("[name='secondName']")) {
                    form.querySelector("[name='secondName']").value = "";
                }
                if (form.querySelectorAll("[name^='messageFields[']")) {
                    form.querySelectorAll("[name^='messageFields[']").forEach(function (el) {
                        el.value = "";
                    });
                }
                //simple redirect to thank you page
                setTimeout(function () {
                    window.location.href = '/thank-you'
                }, 5000);

            } else {
                res = "<ul>" + res + "</ul>";
                document.getElementById("resultMessage" + formId).classList.add('error');
                document.getElementById("resultMessage" + formId).classList.remove('success');
            }
            document.getElementById("resultMessage" + formId).innerHTML = res;
            setTimeout(function () {
                document.getElementById("btn-send-contact" + formId).disabled = false;
            }, 1500);
        } else if (http.readyState == 4 && http.status !== 200) { //error occurred
            var name = "";
            if (fromName.length) {
                name = fromName;
            }
            if (secondName.length) {
                name = name + " " + secondName;
            }
            if (name.length) {
                name = ", " + name;
            }
            res = "Sorry" + name + ", some error occurred while sending. Try to call us or send us an e-mail";
            document.getElementById("resultMessage" + formId).innerHTML = res;
            document.getElementById("resultMessage" + formId).classList.add('error');
            document.getElementById("resultMessage" + formId).classList.remove('success');
            setTimeout(function () {
                document.getElementById("btn-send-contact" + formId).disabled = false;
            }, 1500);
        }
    };
    http.send(params);
}

/**
 * Sticky menu on scroll
 */
window.onscroll = function changeNav() {
    var navBar = document.getElementById('topmenu'),
        navBarHeight = navBar.offsetHeight,
        scrollPos = window.scrollY;

    if (scrollPos <= navBarHeight) {
        navBar.className = ('');
    } else {
        navBar.className = ('sticky');
    }
};

/**
 * Show/hide one form field based on selection
 */
var kenteken = document.getElementsByClassName("showIfSelect");
if (kenteken.length) {
    kenteken = kenteken[0];
    var selectId = kenteken.getAttribute("data-select");
    var selectEl = document.getElementById(selectId);
    selectEl.addEventListener("change", function () {
        if (this.value == "Oude Meer") {
            kenteken.classList.add("visible");
            kenteken.getElementsByTagName("input")[0].required = true;
        } else {
            kenteken.classList.remove("visible");
            kenteken.getElementsByTagName("input")[0].required = false;
        }
    });
}

/**
 * Toggle menu on mobile device
 * @type {NodeList}
 */
var togglemenu = document.getElementsByClassName("toggle-menu");
for (i = 0; i < togglemenu.length; i++) {
    togglemenu[i].addEventListener("click", function () {
        var menu = document.getElementById("nav-wrap");
        var resHeight = 0;
        console.log(parseInt(menu.style.height), menu.style.height);
        if (menu.style.height == "" || parseInt(menu.style.height) == 0) {
            this.classList.add("change");
            var navHeight = document.getElementsByClassName("nav")[0].clientHeight;
            var contactHeight = document.getElementsByClassName("sidebar_contact")[0].clientHeight;
            resHeight = navHeight + contactHeight;
        } else {
            this.classList.remove("change");
        }
        menu.style.height = resHeight + "px";
    });
}

/**
 * Live filter for news page
 * @type {NodeList}
 */
var livefilter = document.getElementsByClassName("live-filter");
for (i = 0; i < livefilter.length; i++) {
    livefilter[i].addEventListener("click", function () {
        var filterBy = this.getAttribute("data-filter");
        var blocks = document.getElementsByClassName("bank_item");
        for (var j = 0; j < blocks.length; j++) {
            if (blocks[j].className.indexOf(filterBy) !== -1) {
                blocks[j].style.display = 'block';
            } else {
                blocks[j].style.display = 'none';
            }
        }
    });
}