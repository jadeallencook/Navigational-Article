(function () {

    new Promise(function (res, rej) {
        var request = new XMLHttpRequest;
        request.onload = function () {
            res(JSON.parse(this.response));
        }
        request.open('get', 'data.json');
        request.send();
    }).then(function (sections) {

        var current = 0;

        function addIconsToToolbar() {
            var container = document.querySelector('div#navigational-toolbar a');
            container.innerHTML = null;
            for (var x = 0; x < sections.length; x++) {
                var section = sections[x];
                var elem = document.createElement('div');
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
                previousLink = sections[current - 1].title.replace('<br />', '');
                previousImage = sections[num].logo;
            }
            if (current === sections.length) {
                nextLink = sections[0].title.replace('<br />', '');
                nextImage = sections[0].logo;
            } else {
                nextLink = sections[current].title.replace('<br />', '');
                nextImage = sections[current].logo;
            }
            nextImageElem.setAttribute('src', nextImage);
            nextLinkElem.setAttribute('href', '#' + nextLink);
            nextLinkElem.onclick = function () {
                if (current === sections.length - 1) current = 0;
                else current++;
                addIconsToFixedToolbar();
            }
            previousImageElem.setAttribute('src', previousImage);
            previousLinkElem.setAttribute('href', '#' + previousLink);
            previousLinkElem.onclick = function () {
                if (current === 0) current = sections.length - 1;
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
                    pElem.innerHTML += ' ' + content.text;
                    if (content.links && content.links.length > 0) {
                        for (let z = 0; z < content.links.length; z++) {
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

    });

})();