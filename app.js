(function () {

    new Promise(function (res, rej) {
        var request = new XMLHttpRequest;
        request.onload = function () {
            res(JSON.parse(this.response));
        }
        request.open('get', 'data.json');
        request.send();
    }).then(function (sections) {

        function visible(el) {
            var top = el.offsetTop;
            var left = el.offsetLeft;
            var width = el.offsetWidth;
            var height = el.offsetHeight;
            while (el.offsetParent) {
                el = el.offsetParent;
                top += el.offsetTop;
                left += el.offsetLeft;
            }
            return (
                top < (window.pageYOffset + window.innerHeight) &&
                left < (window.pageXOffset + window.innerWidth) &&
                (top + height) > window.pageYOffset &&
                (left + width) > window.pageXOffset
            );
        }

        document.onscroll = function () {
            var elem = document.getElementById('navigational-content');
            var footer = document.getElementById('footer-full');
            var toolbar = document.getElementById('navigational-fixed-toolbar');
            if (elem && footer) {
                if (visible(elem) && !visible(footer)) toolbar.style.display = 'block';
                else toolbar.style.display = 'none';
            }
        }

        var current = sections.length;

        function addIconsToToolbar() {
            var container = document.querySelector('div#navigational-toolbar a');
            container.innerHTML = null;
            for (var x = 0; x < sections.length; x++) {
                var section = sections[x];
                var elem = document.createElement('div');
                elem.onclick = function () {
                    if ('ga' in window) {
                        ga('send', 'event', 'New Laws', 'Icon Click', section.title.replace('<br />', ''));
                    }
                }
                var icon = document.createElement('a');
                icon.setAttribute('href', '#' + section.title.replace('<br />', ''));
                var image = document.createElement('img');
                var span = document.createElement('span');
                span.innerHTML = section.title;
                image.setAttribute('src', section.logo);
                icon.appendChild(image);
                elem.appendChild(icon);
                elem.appendChild(span);
                container.appendChild(elem);
            }
        }

        function addIconsToFixedToolbar() {
            var previousLinkElem = document.querySelector('div.previous a');
            var previousImageElem = document.querySelector('div.previous a img');
            var nextLinkElem = document.querySelector('div.next a');
            var nextImageElem = document.querySelector('div.next a img');
            var previousLink, nextLink, previousImage, nextImage;
            if (current === 0) {
                var num = sections.length - 1;
                previousLink = sections[num].title.replace('<br />', '');
                previousImage = sections[num].logo;
            } else {
                var num = current - 1;
                previousLink = sections[num].title.replace('<br />', '');
                previousImage = sections[num].logo;
            }
            if (current === sections.length) {
                nextLink = sections[0].title.replace('<br />', '');
                nextImage = sections[0].logo;
            } else {
                nextLink = sections[current].title.replace('<br />', '');
                if (current === sections.length - 1) nextImage = sections[0].logo;
                else nextImage = sections[current + 1].logo;
            }
            nextImageElem.setAttribute('src', nextImage);
            nextLinkElem.setAttribute('href', '#' + nextLink);
            nextLinkElem.onclick = function () {
                if ('ga' in window) {
                    ga('send', 'event', 'New Laws', 'Fixed Toolbar', nextLinkElem.getAttribute('href'));
                }
                if (current === sections.length) current = 0;
                else current++;
                addIconsToFixedToolbar();
            }
            previousImageElem.setAttribute('src', previousImage);
            previousLinkElem.setAttribute('href', '#' + previousLink);
            previousLinkElem.onclick = function () {
                if (current === 0) current = sections.length;
                else current--;
                addIconsToFixedToolbar();
            }
        }

        function addSectionContent() {
            var container = document.querySelector('div#navigational-content');
            container.innerHTML = null;
            for (var x = 0; x < sections.length; x++) {
                var section = sections[x];
                var sectionElem = document.createElement('a');
                sectionElem.setAttribute('name', section.title.replace('<br />', ''))
                sectionElem.classList.add('section-wrapper');
                var iconContainerElem = document.createElement('div');
                iconContainerElem.classList.add('icon-wrapper');
                var iconElem = document.createElement('div');
                iconElem.classList.add('icon');
                var iconImage = document.createElement('img');
                iconImage.setAttribute('src', section.logo);
                iconElem.appendChild(iconImage);
                iconElem.innerHTML += section.title;
                iconContainerElem.appendChild(iconElem);
                var contentElem = document.createElement('div');
                contentElem.classList.add('content-wrapper');
                for (var y = 0; y < section.sections.length; y++) {
                    var content = section.sections[y];
                    var pElem = document.createElement('p');
                    var titleElem = document.createElement('b');
                    titleElem.innerText = content.title;
                    pElem.appendChild(titleElem);
                    pElem.innerHTML += '•  ' + content.text;
                    if (content.links && content.links.length > 0) {
                        for (var z = 0; z < content.links.length; z++) {
                            var link = content.links[z];
                            var html = '<a target="_blank" href="' + link.location + '">' + link.text + '</a>';
                            pElem.innerHTML = pElem.innerHTML.replace(link.text, html);
                        }
                    }
                    contentElem.appendChild(pElem);
                }
                sectionElem.appendChild(iconContainerElem);
                sectionElem.appendChild(contentElem);
                container.appendChild(sectionElem);
            }
        }

        addIconsToToolbar();
        addIconsToFixedToolbar();
        addSectionContent();

        if (document.querySelector('footer .container')) document.querySelector('footer .container').style.zIndex = 0;

        for (var x = 0; x < document.querySelectorAll('a').length; x++) {
            var link = document.querySelectorAll('a')[x];
            if (link.getAttribute('href') && link.getAttribute('href')[0] === '#') {
                link.addEventListener('click', function () {
                    setTimeout(function () {
                        window.scrollTo(window.scrollX, window.scrollY - 50);
                    }, 10);
                });
            }
        }

    });

})();