(function () {
    var G = window || this,
        even = 'click',
        $ = G.BLOG.$,
        searchIco = $('#search'),
        searchWrap = $('#search-wrap'),
        keyInput = $('#key'),
        back = $('#back'),
        searchPanel = $('#search-panel'),
        searchResult = $('#search-result'),
        searchTpl = $('#search-tpl').innerHTML,
        JSON_DATA = (G.BLOG.ROOT + '/content.json').replace(/\/{2}/g, '/'),
        searchData;

    function loadData(success) {
        if (!searchData) {
            fetch(JSON_DATA)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(function (res) {
                    searchData = res instanceof Array ? res : res.posts;
                    success(searchData);
                })
                .catch(function (error) {
                    console.error('Search data fetch failed:', error);
                });
        } else {
            success(searchData);
        }
    }

    function tpl(html, data) {
        return html.replace(/\{\w+\}/g, function (str) {
            var prop = str.replace(/\{|\}/g, '');
            return data[prop] !== undefined ? data[prop] : '';
        });
    }

    var noop = G.BLOG.noop;
    var root = $('html');

    var Control = {
        show: function () {
            if (G.innerWidth < 768) {
                root.classList.add('lock-size');
            }
            searchPanel.classList.add('in');
        },
        hide: function () {
            if (G.innerWidth < 768) {
                root.classList.remove('lock-size');
            }
            searchPanel.classList.remove('in');
        }
    };

    function render(data) {
        var html = '';
        if (data.length) {
            html = data.map(function (post) {
                return tpl(searchTpl, {
                    title: post.title,
                    path: (G.BLOG.ROOT + '/' + post.path).replace(/\/{2,}/g, '/'),
                    date: new Date(post.date).toLocaleDateString(),
                    tags: post.tags.map(function (tag) {
                        return '<span>#' + tag.name + '</span>';
                    }).join(' ')
                });
            }).join('');
        } else {
            html = '<li class="tips"><span class="material-symbols-outlined" style="font-size:48px;">sentiment_dissatisfied</span><p>Results not found!</p></li>';
        }
        searchResult.innerHTML = html;
    }

    function regtest(raw, regExp) {
        regExp.lastIndex = 0;
        return regExp.test(raw);
    }

    function matcher(post, regExp) {
        return regtest(post.title, regExp) || 
               post.tags.some(function (tag) { return regtest(tag.name, regExp); }) || 
               regtest(post.text, regExp);
    }

    function search(e) {
        var key = this.value.trim();
        if (!key) {
            Control.hide();
            return;
        }

        var regExp = new RegExp(key.replace(/[ ]/g, '|'), 'gmi');

        loadData(function (data) {
            var result = data.filter(function (post) {
                return matcher(post, regExp);
            });
            render(result);
            Control.show();
        });

        e.preventDefault();
    }

    if (searchIco && keyInput) {
        searchIco.addEventListener(even, function () {
            searchWrap.classList.toggle('in');
            keyInput.value = '';
            if (searchWrap.classList.contains('in')) {
                keyInput.focus();
            } else {
                keyInput.blur();
                Control.hide();
            }
        });
    }

    if (back) {
        back.addEventListener(even, function () {
            searchWrap.classList.remove('in');
            Control.hide();
        });
    }

    document.addEventListener(even, function (e) {
        if (e.target.id !== 'key' && even === 'click') {
            Control.hide();
        }
    });

    if (keyInput) {
        keyInput.addEventListener('input', search);
        keyInput.addEventListener(even, search);
    }
}).call(this);
