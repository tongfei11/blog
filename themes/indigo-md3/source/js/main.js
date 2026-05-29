(function (w, d) {
    var body = d.body,
        $ = d.querySelector.bind(d),
        $$ = d.querySelectorAll.bind(d),
        root = d.documentElement,
        gotop = $('#gotop'),
        menu = $('#menu'),
        header = $('#header'),
        mask = $('#mask'),
        menuToggle = $('#menu-toggle'),
        menuOff = $('#menu-off'),
        loading = $('#loading'),
        animate = w.requestAnimationFrame,
        scrollSpeed = 200 / (1000 / 60),
        forEach = Array.prototype.forEach,
        even = 'click',
        isWX = /micromessenger/i.test(navigator.userAgent),
        noop = function () { },
        offset = function (el) {
            var x = el.offsetLeft,
                y = el.offsetTop;

            if (el.offsetParent) {
                var pOfs = offset(el.offsetParent);
                x += pOfs.x;
                y += pOfs.y;
            }

            return { x: x, y: y };
        },
        rootScollTop = function() {
            return d.documentElement.scrollTop || d.body.scrollTop;
        };

    var Blog = {
        goTop: function (end) {
            var top = rootScollTop();
            var interval = arguments.length > 2 ? arguments[1] : Math.abs(top - end) / scrollSpeed;

            if (top && top > end) {
                w.scrollTo(0, Math.max(top - interval, 0));
                animate(this.goTop.bind(this, end, interval));
            } else if (end && top < end) {
                w.scrollTo(0, Math.min(top + interval, end));
                animate(this.goTop.bind(this, end, interval));
            } else {
                this.toc.actived(end);
            }
        },
        toggleGotop: function (top) {
            if (gotop) {
                if (top > w.innerHeight / 2) {
                    gotop.classList.add('in');
                } else {
                    gotop.classList.remove('in');
                }
            }
        },
        toggleMenu: function (flag) {
            var main = $('#main');
            if (flag) {
                menu.classList.remove('hide');

                if (w.innerWidth < 1281) {
                    mask.classList.add('in');
                    menu.classList.add('show');

                    if (isWX) {
                        var top = rootScollTop();
                        main.classList.add('lock');
                        main.scrollTop = top;
                    } else {
                        root.classList.add('lock');
                    }
                }
            } else {
                menu.classList.remove('show');
                mask.classList.remove('in');
                if (isWX) {
                    var top = main.scrollTop;
                    main.classList.remove('lock');
                    w.scrollTo(0, top);
                } else {
                    root.classList.remove('lock');
                }
            }
        },
        fixedHeader: function (top) {
            if (top > header.clientHeight) {
                header.classList.add('fixed');
            } else {
                header.classList.remove('fixed');
            }
        },
        // Auto-adapt menu and system languages dynamically at runtime
        i18n: {
            init: function() {
                var lang = (navigator.language || navigator.userLanguage || 'zh-CN').toLowerCase();
                var isZh = lang.indexOf('zh') === 0;

                var zhMenuMap = {
                    'home': '首页',
                    'archive': '归档',
                    'archives': '归档',
                    'sell': '标签',
                    'tag': '标签',
                    'tags': '标签',
                    'category': '分类',
                    'categories': '分类'
                };

                var enMenuMap = {
                    '首页': 'Home',
                    '主页': 'Home',
                    '归档': 'Archives',
                    '标签': 'Tags',
                    '分类': 'Categories'
                };

                // 1. Translate menu drawer texts
                var menuItems = $$('.drawer-nav-item');
                forEach.call(menuItems, function(item) {
                    var iconElement = item.querySelector('.nav-icon');
                    var textElement = item.querySelector('.nav-text');
                    if (textElement) {
                        var currentText = textElement.textContent.trim().toLowerCase();
                        if (isZh) {
                            if (zhMenuMap[currentText]) {
                                textElement.textContent = zhMenuMap[currentText];
                            }
                        } else {
                            var cnText = textElement.textContent.trim();
                            if (enMenuMap[cnText]) {
                                textElement.textContent = enMenuMap[cnText];
                            }
                        }
                    }
                });

                // 2. Translate article cards "Read More" button
                var postMores = $$('.post-more');
                forEach.call(postMores, function(el) {
                    if (isZh) {
                        el.textContent = '阅读全文';
                    } else {
                        el.textContent = 'Read More';
                    }
                });

                // 3. Translate search placeholder
                var searchInput = $('.search-input');
                if (searchInput) {
                    if (isZh) {
                        searchInput.setAttribute('placeholder', '搜索...');
                    } else {
                        searchInput.setAttribute('placeholder', 'Search...');
                    }
                }

                // 4. Translate post navigation tips
                var navTips = $$('.post-nav-link .tips');
                forEach.call(navTips, function(el) {
                    var txt = el.textContent.trim().toLowerCase();
                    if (isZh) {
                        if (txt.indexOf('prev') !== -1) {
                            el.innerHTML = '<span class="material-symbols-outlined nav-arrow-small" style="font-size: 14px; vertical-align: middle;">arrow_back</span> 上一篇';
                        } else if (txt.indexOf('next') !== -1) {
                            el.innerHTML = '下一篇 <span class="material-symbols-outlined nav-arrow-small" style="font-size: 14px; vertical-align: middle;">arrow_forward</span>';
                        }
                    } else {
                        if (txt.indexOf('上一篇') !== -1) {
                            el.innerHTML = 'Previous Post';
                        } else if (txt.indexOf('下一篇') !== -1) {
                            el.innerHTML = 'Next Post';
                        }
                    }
                });

                // 5. Translate post TOC title
                var tocTitle = $('.post-toc-title');
                if (tocTitle) {
                    if (isZh) {
                        tocTitle.textContent = '文章目录';
                    } else {
                        tocTitle.textContent = 'Table of Contents';
                    }
                }

                // 6. Translate sponsor button
                var rewardBtn = $('#rewardBtn span');
                if (rewardBtn) {
                    if (isZh) {
                        rewardBtn.textContent = '赞赏';
                    } else {
                        rewardBtn.textContent = 'Sponsor';
                    }
                }

                // 7. Translate last-updated copyright metadata
                var lastUpdated = $('.last-updated');
                if (lastUpdated) {
                    var text = lastUpdated.textContent.trim();
                    if (isZh && text.indexOf('Last updated:') !== -1) {
                        lastUpdated.innerHTML = lastUpdated.innerHTML.replace('Last updated:', '最后更新于:');
                    } else if (!isZh && text.indexOf('最后更新于:') !== -1) {
                        lastUpdated.innerHTML = lastUpdated.innerHTML.replace('最后更新于:', 'Last updated:');
                    }
                }

                // 8. Translate share title
                var shareTitle = $('.share-title');
                if (shareTitle) {
                    if (isZh) {
                        shareTitle.textContent = '分享到';
                    } else {
                        shareTitle.textContent = 'Share to';
                    }
                }

                // 9. Translate WeChat share title
                var wxShareTitle = $('.wx-share-title');
                if (wxShareTitle) {
                    if (isZh) {
                        wxShareTitle.textContent = '微信扫码分享';
                    } else {
                        wxShareTitle.textContent = 'Scan QR code to share on WeChat';
                    }
                }
            }
        },
        toast: function(message) {
            var oldToast = $('.md-toast');
            if (oldToast) {
                oldToast.remove();
            }

            var toast = d.createElement('div');
            toast.className = 'md-toast';
            toast.innerHTML = '<span class="material-symbols-outlined" style="font-size: 20px;">info</span><span>' + message + '</span>';
            d.body.appendChild(toast);

            setTimeout(function() {
                toast.classList.add('in');
            }, 50);

            setTimeout(function() {
                toast.classList.remove('in');
                setTimeout(function() {
                    toast.remove();
                }, 300);
            }, 3000);
        },
        // Material Ripple effect
        ripple: function() {
            var targets = $$(
                '.md-btn, .drawer-nav-item-wrap, .md-fab-mini, .md-icon-button, .post-nav-link, .tags-list-item'
            );
            forEach.call(targets, function(el) {
                el.classList.add('md-ripple');
                el.addEventListener('click', function(e) {
                    var circle = d.createElement('span');
                    circle.classList.add('ripple-effect');
                    
                    var rect = this.getBoundingClientRect();
                    var size = Math.max(rect.width, rect.height);
                    
                    circle.style.width = circle.style.height = size + 'px';
                    circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
                    circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
                    
                    var prevCircle = this.querySelector('.ripple-effect');
                    if (prevCircle) {
                        prevCircle.remove();
                    }
                    
                    this.appendChild(circle);
                    
                    setTimeout(function() {
                        circle.remove();
                    }, 500);
                });
            });
        },
        toc: (function () {
            var toc = $('#post-toc');

            if (!toc || !toc.children.length) {
                return {
                    fixed: noop,
                    actived: noop
                }
            }

            var bannerH = 0,
                headerH = header.clientHeight,
                titles = $('#post-content') ? $('#post-content').querySelectorAll('h1, h2, h3, h4, h5, h6') : [];

            if (!titles.length) {
                return {
                    fixed: noop,
                    actived: noop
                }
            }

            var activeLink = toc.querySelector('a[href="#' + titles[0].id + '"]');
            if (activeLink) {
                activeLink.parentNode.classList.add('active');
            }

            return {
                fixed: function (top) {
                    top >= bannerH - headerH ? toc.classList.add('fixed') : toc.classList.remove('fixed');
                },
                actived: function (top) {
                    for (var i = 0, len = titles.length; i < len; i++) {
                        if (top > offset(titles[i]).y - headerH - 5) {
                            var prevListEle = toc.querySelector('li.active');
                            var targetLink = toc.querySelector('a[href="#' + titles[i].id + '"]');
                            if (targetLink) {
                                var currListEle = targetLink.parentNode;
                                if (prevListEle) prevListEle.classList.remove('active');
                                currListEle.classList.add('active');
                            }
                        }
                    }

                    if (top < offset(titles[0]).y) {
                        var activeEle = toc.querySelector('li.active');
                        var firstLink = toc.querySelector('a[href="#' + titles[0].id + '"]');
                        if (activeEle) activeEle.classList.remove('active');
                        if (firstLink) firstLink.parentNode.classList.add('active');
                    }
                }
            }
        })(),
        hideOnMask: [],
        modal: function (target) {
            this.$modal = $(target);
            if (!this.$modal) return;
            this.$off = this.$modal.querySelector('.close');

            var _this = this;

            this.show = function () {
                mask.classList.add('in');
                _this.$modal.classList.add('ready');
                setTimeout(function () {
                    _this.$modal.classList.add('in');
                }, 0)
            }

            this.onHide = noop;

            this.hide = function () {
                _this.onHide();
                mask.classList.remove('in');
                _this.$modal.classList.remove('in');
                setTimeout(function () {
                    _this.$modal.classList.remove('ready');
                }, 300)
            }

            this.toggle = function () {
                return _this.$modal.classList.contains('in') ? _this.hide() : _this.show();
            }

            Blog.hideOnMask.push(this.hide);
            this.$off && this.$off.addEventListener(even, this.hide);
        },
        share: function () {
            var pageShare = $('#pageShare'),
                fab = $('#shareFab');

            var shareModal = new this.modal('#globalShare');

            var menuShare = $('#menuShare');
            if (menuShare) {
                menuShare.addEventListener(even, shareModal.toggle.bind(shareModal));
            }

            if (fab) {
                fab.addEventListener(even, function () {
                    pageShare.classList.toggle('in')
                }, false)

                d.addEventListener(even, function (e) {
                    !fab.contains(e.target) && pageShare.classList.remove('in')
                }, false)
            }

            var wxModal = new this.modal('#wxShare');
            if (wxModal.$modal) {
                wxModal.onHide = shareModal.hide.bind(shareModal);

                forEach.call($$('.wxFab'), function (el) {
                    el.addEventListener(even, wxModal.toggle.bind(wxModal))
                });
            }
        },
        search: function () {
            var searchWrap = $('#search-wrap');
            var searchIco = $('#search');
            if (!searchWrap || !searchIco) return;

            function toggleSearch() {
                searchWrap.classList.toggle('in');
            }

            searchIco.addEventListener(even, toggleSearch);
        },
        reward: function () {
            var modal = new this.modal('#reward');
            var rewardBtn = $('#rewardBtn');
            if (!rewardBtn) return;
            
            rewardBtn.addEventListener(even, modal.toggle.bind(modal));

            var $rewardToggle = $('#rewardToggle');
            var $rewardCode = $('#rewardCode');
            if ($rewardToggle && $rewardCode) {
                $rewardToggle.addEventListener('change', function () {
                    $rewardCode.src = this.checked ? this.dataset.alipay : this.dataset.wechat
                })
            }
        },
        // We now use pure CSS grid columns for archive rendering, so JS calculations are omitted.
        waterfall: noop,
        tabBar: function (el) {
            el.parentNode.parentNode.classList.toggle('expand')
        },
        page: (function () {
            var $elements = $$('.fade, .fade-scale');
            var visible = false;

            return {
                loaded: function () {
                    forEach.call($elements, function (el) {
                        el.classList.add('in')
                    });
                    visible = true;
                },
                unload: function () {
                    forEach.call($elements, function (el) {
                        el.classList.remove('in')
                    });
                    visible = false;
                },
                visible: visible
            }
        })(),
        lightbox: (function () {
            function LightBox(element) {
                this.$img = element.querySelector('img');
                this.$overlay = element.querySelector('.overlay');
                this.margin = 40;
                this.title = this.$img.title || this.$img.alt || '';
                this.isZoom = false;

                var naturalW, naturalH, imgRect, docW, docH;

                this.calcRect = function () {
                    docW = body.clientWidth;
                    docH = body.clientHeight;
                    var inH = docH - this.margin * 2;
                    var w = naturalW;
                    var h = naturalH;
                    var t = this.margin;
                    var sw = w > docW ? docW / w : 1;
                    var sh = h > inH ? inH / h : 1;
                    var s = Math.min(sw, sh);

                    w = w * s;
                    h = h * s;

                    return {
                        w: w,
                        h: h,
                        t: (docH - h) / 2 - imgRect.top,
                        l: (docW - w) / 2 - imgRect.left + this.$img.offsetLeft
                    }
                }

                this.setImgRect = function (rect) {
                    this.$img.style.cssText = 'position: fixed; z-index: 401; width: ' + rect.w + 'px; max-width: ' + rect.w + 'px; height:' + rect.h + 'px; top: ' + rect.t + 'px; left: ' + rect.l + 'px';
                }

                this.setFrom = function () {
                    this.setImgRect({
                        w: imgRect.width,
                        h: imgRect.height,
                        t: imgRect.top,
                        l: imgRect.left
                    })
                }

                this.setTo = function () {
                    this.setImgRect(this.calcRect());
                }

                this.addTitle = function () {
                    if (!this.title) {
                        return;
                    }
                    this.$caption = d.createElement('div');
                    this.$caption.innerHTML = this.title;
                    this.$caption.className = 'overlay-title';
                    element.appendChild(this.$caption);
                }

                this.removeTitle = function () {
                    if (this.$caption && this.$caption.parentNode) {
                        element.removeChild(this.$caption);
                    }
                }

                var _this = this;

                this.zoomIn = function () {
                    naturalW = this.$img.naturalWidth || this.$img.width;
                    naturalH = this.$img.naturalHeight || this.$img.height;
                    imgRect = this.$img.getBoundingClientRect();
                    element.style.height = imgRect.height + 'px';
                    element.classList.add('ready');
                    this.setFrom();
                    this.addTitle();
                    this.$img.classList.add('zoom-in');

                    setTimeout(function () {
                        element.classList.add('active');
                        _this.setTo();
                        _this.isZoom = true;
                    }, 0);
                }

                this.zoomOut = function () {
                    this.isZoom = false;
                    element.classList.remove('active');
                    this.$img.classList.add('zoom-in');
                    this.setFrom();
                    setTimeout(function () {
                        _this.$img.classList.remove('zoom-in');
                        _this.$img.style.cssText = '';
                        _this.removeTitle();
                        element.classList.remove('ready');
                        element.removeAttribute('style');
                    }, 300);
                }

                element.addEventListener('click', function (e) {
                    _this.isZoom ? _this.zoomOut() : e.target.tagName === 'IMG' && _this.zoomIn()
                })

                d.addEventListener('scroll', function () {
                    if (_this.isZoom) _this.zoomOut()
                })

                w.addEventListener('resize', function () {
                    if (_this.isZoom) _this.zoomOut()
                })
            }

            forEach.call($$('.img-lightbox'), function (el) {
                new LightBox(el)
            })
        })(),
        loadScript: function (scripts) {
            scripts.forEach(function (src) {
                var s = d.createElement('script');
                s.src = src;
                s.async = true;
                body.appendChild(s);
            })
        }
    };

    w.addEventListener('load', function () {
        if (loading) loading.classList.remove('active');
        Blog.page.loaded();
        if (w.lazyScripts && w.lazyScripts.length) {
            Blog.loadScript(w.lazyScripts)
        }
    });

    function initAll() {
        Blog.i18n.init();
        Blog.ripple();
        var top = rootScollTop();
        Blog.toc.fixed(top);
        Blog.toc.actived(top);
        Blog.page.loaded();
    }

    if (d.readyState === 'loading') {
        d.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    var ignoreUnload = false;
    var $mailTarget = $('a[href^="mailto"]');
    if($mailTarget) {
        $mailTarget.addEventListener(even, function () {
            ignoreUnload = true;
        });
    }

    w.addEventListener('beforeunload', function (e) {
        if (!ignoreUnload) {
            Blog.page.unload();
        } else {
            ignoreUnload = false;
        }
    });

    w.addEventListener('pageshow', function () {
        if (!Blog.page.visible) Blog.page.loaded();
    });

    w.addEventListener('resize', function () {
        w.BLOG.even = even = 'click';
        Blog.toggleMenu();
    });

    if (gotop) {
        gotop.addEventListener(even, function () {
            animate(Blog.goTop.bind(Blog, 0));
        }, false);
    }

    if (menuToggle) {
        menuToggle.addEventListener(even, function (e) {
            Blog.toggleMenu(true);
            e.preventDefault();
        }, false);
    }

    if (menuOff) {
        menuOff.addEventListener(even, function () {
            menu.classList.add('hide');
        }, false);
    }

    if (mask) {
        mask.addEventListener(even, function (e) {
            Blog.toggleMenu();
            Blog.hideOnMask.forEach(function (hide) {
                hide()
            });
            e.preventDefault();
        }, false);
    }

    d.addEventListener('scroll', function () {
        var top = rootScollTop();
        Blog.toggleGotop(top);
        Blog.fixedHeader(top);
        Blog.toc.fixed(top);
        Blog.toc.actived(top);
    }, false);

    if (w.BLOG.SHARE) {
        Blog.share()
    }

    if (w.BLOG.REWARD) {
        Blog.reward()
    }

    // RSS Subscription feed clipboard copying
    var rssButton = $('#rss-button');
    if (rssButton) {
        rssButton.addEventListener('click', function(e) {
            e.preventDefault();
            var relativeUrl = rssButton.getAttribute('data-url');
            var absoluteUrl = new URL(relativeUrl, window.location.href).href;
            
            var lang = (navigator.language || navigator.userLanguage || 'zh-CN').toLowerCase();
            var isZh = lang.indexOf('zh') === 0;
            var successMessage = isZh ? '订阅地址已复制到剪贴板！' : 'RSS feed address copied to clipboard!';
            var errorMessage = isZh ? '复制失败，请手动复制地址：' + absoluteUrl : 'Copy failed, please copy manually: ' + absoluteUrl;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(absoluteUrl).then(function() {
                    Blog.toast(successMessage);
                }).catch(function() {
                    Blog.toast(errorMessage);
                });
            } else {
                var textarea = d.createElement('textarea');
                textarea.value = absoluteUrl;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                d.body.appendChild(textarea);
                textarea.select();
                try {
                    d.execCommand('copy');
                    Blog.toast(successMessage);
                } catch (err) {
                    Blog.toast(errorMessage);
                }
                d.body.removeChild(textarea);
            }
        });
    }

    Blog.noop = noop;
    Blog.even = even;
    Blog.$ = $;
    Blog.$$ = $$;

    Object.keys(Blog).reduce(function (g, e) {
        g[e] = Blog[e];
        return g
    }, w.BLOG);

})(window, document);
