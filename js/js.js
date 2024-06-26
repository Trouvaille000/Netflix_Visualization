$(window).load(function () {
    $(".loading").fadeOut()
})
$(function () {
    echarts_1();
    echarts_2();
    echarts_3();
    echarts_4();
    echarts_5();
    pie1();
    loadCarouselData();
    startCarousel();
    worldmap();


    //类型分布
    function pie1() {
        var myChart = echarts.init(document.getElementById('pie1'));
        // 初始化饼图的基本配置
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                right: 0,
                top: 30,
                height: 160,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 10,
                textStyle: {
                    color: 'rgba(255,255,255,.6)',
                    fontSize: 12
                },
                orient: 'vertical',
                data: []
            },
            series: [{
                name: 'Type Distribution',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [],
                // 自定义每个扇区的颜色
                itemStyle: {
                    color: function (params) {
                        // 蓝色和绿色交替显示
                        return params.dataIndex % 2 === 0 ? '#418DFD' : '#33CFA5';
                    }
                }
            }]
        });

        // 异步加载 JSON 数据
        $.getJSON('../cleaned_netflix_titles.json', function (data) {
            console.log(data); // 查看加载的数据
            var typeDistribution = {};

            // 统计类型分布
            data.forEach(function (item) {
                if (typeDistribution[item.type]) {
                    typeDistribution[item.type]++;
                } else {
                    typeDistribution[item.type] = 1;
                }
            });

            // 准备数据以用于 ECharts
            var processedData = [];
            for (var type in typeDistribution) {
                processedData.push({
                    value: typeDistribution[type],
                    name: type
                });
            }

            myChart.setOption({
                legend: {
                    data: processedData.map(item => item.name)
                },
                series: [{
                    name: 'Type Distribution',
                    data: processedData
                }]
            });

            window.addEventListener('resize', function () {
                myChart.resize();
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("An error occurred while loading the data:", errorThrown);
        });

    }

    //电影top5
    function echarts_1() {
        var myChart = echarts.init(document.getElementById('echart1'));

        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                textStyle: {
                    color: 'rgba(255,255,255,0.8)'
                },
                data: []
            },
            series: [
                {
                    name: 'Country',
                    type: 'pie',
                    radius: ['15%', '80%'],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    data: [],
                    itemStyle: {
                        borderRadius: 8
                    },
                    color: ['#62c98d', '#2f89cf', '#4cb9cf', '#53b666', '#62c98d', '#205acf', '#c9c862', '#c98b62', '#c962b9', '#c96262'],
                }
            ]
        };

        myChart.setOption(option);

        $.getJSON('../cleaned_netflix_titles.json', function (data) {
            var countryCount = {};

            data.forEach(function (item) {
                if (item.type === 'Movie' && item.country !== 'unknown') {
                    var country = item.country;
                    if (countryCount[country]) {
                        countryCount[country]++;
                    } else {
                        countryCount[country] = 1;
                    }
                }
            });

            var sortedCountries = Object.entries(countryCount).sort((a, b) => b[1] - a[1]);
            var top5Countries = sortedCountries.slice(0, 5).map(([country, count]) => ({
                name: country,
                value: count
            }));

            option.legend.data = top5Countries.map(item => item.name);
            option.series[0].data = top5Countries;

            myChart.setOption(option);

            window.addEventListener('resize', function () {
                myChart.resize();
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("An error occurred while loading the data:", errorThrown);
        });
    }

    //TVtop5
    function echarts_2() {
        var myChart = echarts.init(document.getElementById('echart2'));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                icon: 'circle',
                textStyle: {
                    color: 'rgba(255,255,255,.6)',
                },
                data: []
            },
            calculable: true,
            series: [{
                name: 'Country',
                type: 'pie',
                color: ['#62c98d', '#2f89cf', '#4cb9cf', '#53b666', '#62c98d', '#205acf', '#c9c862', '#c98b62', '#c962b9', '#c96262'],
                startAngle: 0,
                radius: [51, 100],
                center: ['50%', '45%'],
                roseType: 'area',
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length2: 1,
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: []
            }]
        };

        myChart.setOption(option);

        $.getJSON('../cleaned_netflix_titles.json', function (data) {
            var countryCount = {};

            data.forEach(function (item) {
                if (item.type === 'TV Show' && item.country !== 'unknown') {
                    var country = item.country;
                    if (countryCount[country]) {
                        countryCount[country]++;
                    } else {
                        countryCount[country] = 1;
                    }
                }
            });

            var sortedCountries = Object.entries(countryCount).sort((a, b) => b[1] - a[1]);
            var top5Countries = sortedCountries.slice(0, 5).map(([country, count]) => ({
                name: country,
                value: count
            }));

            var legendData = top5Countries.map(item => item.name);
            var seriesData = top5Countries;

            option.legend.data = legendData;
            option.series[0].data = seriesData;

            myChart.setOption(option);

            window.addEventListener('resize', function () {
                myChart.resize();
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("An error occurred while loading the data:", errorThrown);
        });
    }

    //电影时长分布
    function echarts_3() {
        var myChart = echarts.init(document.getElementById('echart3'));
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Movies duration'],
                textStyle: {
                    color: 'rgba(255,255,255,0.8)'
                }
            },
            xAxis: {
                type: 'category',
                data: [],
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,.1)"
                    }
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ],
            series: [{
                name: 'Movies duration',
                type: 'bar',
                itemStyle: {
                    color: '#5ec9db'
                },
                data: []
            }]
        };

        myChart.setOption(option);

        $.getJSON('../cleaned_netflix_titles.json', function (data) {
            var vc_duration_movie = data
                .filter(item => item.type === 'Movie')
                .map(item => item.duration)
                .sort((a, b) => a - b);

            option.xAxis.data = vc_duration_movie;
            option.series[0].data = vc_duration_movie;

            myChart.setOption(option);

            window.addEventListener('resize', function () {
                myChart.resize();
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("An error occurred while loading the data:", errorThrown);
        });
    }

    // 不同分级分布数量
    function echarts_4() {
        var myChart = echarts.init(document.getElementById("echart4"));

        // 初始化条形图的基本配置
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Movies', 'TV Shows'],
                icon: 'circle',
                textStyle: {
                    color: 'rgba(255,255,255,.6)',
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['G', 'TV-G', 'TV-Y', 'TV-Y7', 'TV-Y7-FV', 'PG', 'TV-PG', 'PG-13', 'TV-14', 'R', 'NC-17', 'TV-MA', 'NR', 'UR'],
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                }, //左线色
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                }, //左线色
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,.1)"
                    }
                }, //x轴线
            },
            series: [
                {
                    name: 'Movies',
                    type: 'bar',
                    itemStyle: {
                        color: '#418DFD'  // 蓝色
                    },
                    data: []
                },
                {
                    name: 'TV Shows',
                    type: 'bar',
                    itemStyle: {
                        color: '#33CFA5'  // 绿色
                    },
                    data: []
                }
            ]
        });

        // 异步加载 JSON 数据
        $.getJSON('../netflix_titles.json', function (data) {
            var moviesRating = {};
            var tvRating = {};

            // 统计每个等级的电影和电视节目数量
            data.forEach(function (item) {
                if (item.type === "Movie") {
                    moviesRating[item.rating] = (moviesRating[item.rating] || 0) + 1;
                } else if (item.type === "TV Show") {
                    tvRating[item.rating] = (tvRating[item.rating] || 0) + 1;
                }
            });

            // 准备数据以用于 ECharts
            var movieRatingsData = [];
            var tvRatingsData = [];

            // 使用定义好的排序
            var ratingOrder = ['G', 'TV-G', 'TV-Y', 'TV-Y7', 'TV-Y7-FV', 'PG', 'TV-PG', 'PG-13', 'TV-14', 'R', 'NC-17', 'TV-MA', 'NR', 'UR'];
            ratingOrder.forEach(function (rating) {
                movieRatingsData.push(moviesRating[rating] || 0);
                tvRatingsData.push(tvRating[rating] || 0);
            });

            myChart.setOption({
                series: [
                    {
                        name: 'Movies',
                        data: movieRatingsData
                    },
                    {
                        name: 'TV Shows',
                        data: tvRatingsData
                    }
                ]
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("An error occurred while loading the data:", errorThrown);
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }

    function echarts_5() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart5'));

        $.getJSON('../cleaned_netflix_titles.json', function (data) {
            var categoriesByYear = {};
            var allCategories = new Set();

            data.forEach(function (item) {
                if (item.type === 'Movie') { // 只考虑电影
                    var year = item.release_year;
                    if (year >= 2000) { // 只考虑2000年后的数据
                        var categories = item.listed_in.split(',').map(function (category) {
                            return category.trim();
                        });

                        if (!categoriesByYear[year]) {
                            categoriesByYear[year] = {};
                        }

                        categories.forEach(function (category) {
                            allCategories.add(category);
                            if (categoriesByYear[year][category]) {
                                categoriesByYear[year][category]++;
                            } else {
                                categoriesByYear[year][category] = 1;
                            }
                        });
                    }
                }
            });

            var allYears = Object.keys(categoriesByYear).sort();
            var allCategoriesArray = Array.from(allCategories);

            var colors = ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3'];
            while (colors.length < allCategoriesArray.length) {
                colors = colors.concat(colors); // 如果颜色不够，则重复这些颜色
            }

            var seriesData = allCategoriesArray.map(function (category, index) {
                return {
                    name: category,
                    type: 'bar',
                    stack: 'total',
                    itemStyle: {
                        color: colors[index]
                    },
                    data: allYears.map(function (year) {
                        return categoriesByYear[year][category] || 0;
                    })
                };
            });

            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: allCategoriesArray,
                    textStyle: {
                        color: 'skyblue'
                    },
                    type: 'scroll'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'category',
                    data: allYears,
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,1)'
                        }
                    }
                },
                xAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,1)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,.1)"
                        }
                    }
                },
                series: seriesData
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);

            window.addEventListener("resize", function () {
                myChart.resize();
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("An error occurred while loading the data:", errorThrown);
        });
    }

    $(document).ready(function () {
        echarts_5();
    });

    function loadCarouselData(year) {
        $.getJSON('../cleaned_netflix_titles.json', function (data) {
            var movies = data.filter(function (item) {
                return item.type === 'Movie' && item.release_year === year;
            });

            var carousel = $('#carousel');
            carousel.empty();  // 清空现有的内容

            movies.forEach(function (movie) {
                carousel.append(
                    '<li>' +
                    '<p><span>' + movie.title + '</span><span>' + (movie.director || 'N/A') + '</span><span>' + movie.year_added + '</span></p>' +
                    '</li>'
                );
            });

            startCarousel();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("An error occurred while loading the data:", errorThrown);
        });
    }

    function startCarousel() {
        var carousel = $('#carousel');
        var items = carousel.children();
        var itemHeight = items.first().outerHeight();
        var totalHeight = items.length * itemHeight;
        var currentIndex = 0;

        var interval = setInterval(function () {
            currentIndex++;
            var translateY = -currentIndex * itemHeight;
            carousel.css('transform', 'translateY(' + translateY + 'px)');

            if ((currentIndex + 1) * itemHeight >= totalHeight) {
                clearInterval(interval);
            }
        }, 3000);
    }

    $(document).ready(function () {
        // 默认加载2019年的数据
        loadCarouselData(2019);

        // 为每个年份按钮添加点击事件
        $('.year-button').click(function () {
            var year = $(this).data('year');
            loadCarouselData(year);
        });
    });


    $(document).ready(function () {
        var chartDom = document.getElementById('tv');
        var myChart = echarts.init(chartDom);

        var option = {
            tooltip: {
                formatter: function (info) {
                    var value = info.value;
                    var treePathInfo = info.treePathInfo;
                    var treePath = [];

                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name);
                    }

                    return [
                        '<div class="tooltip-title">' + treePath.join('/') + '</div>',
                        'Count: ' + value
                    ].join('');
                }
            },
            legend: {
                data: ['Movie', 'TV Show'],
                selectedMode: 'single',
                textStyle: {
                    color: 'rgba(255,255,255,0.8)'
                },
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    type: 'treemap',
                    name: 'Genres',
                    data: [],
                    leafDepth: 1,
                    label: {
                        show: true,
                        formatter: '{b}'
                    },
                    upperLabel: {
                        show: true,
                        height: 30
                    },
                    itemStyle: {
                        borderColor: '#2c343c'
                    }
                }
            ],
            color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0']
        };

        function loadData(type) {
            $.getJSON('../cleaned_netflix_titles.json', function (data) {
                var filteredData = data.filter(item => item.type === type);
                var genreCount = {};

                filteredData.forEach(item => {
                    if (item.genre) {
                        item.genre.forEach(genre => {
                            if (genreCount[genre]) {
                                genreCount[genre]++;
                            } else {
                                genreCount[genre] = 1;
                            }
                        });
                    }
                });

                var genreData = Object.keys(genreCount).map(key => {
                    return { name: key, value: genreCount[key] };
                });

                option.series[0].data = genreData;
                option.series[0].name = type + ' Genres';
                myChart.setOption(option);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("An error occurred while loading the data:", errorThrown);
            });
        }

        // 初始化图表并加载电影数据
        myChart.setOption(option);

        // 默认加载电影数据
        loadData('TV Show');

        // 监听图例选择变化
        myChart.on('legendselectchanged', function (params) {
            var selected = params.name;
            loadData(selected);
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    });

    //世界地图
    function worldmap() {
        var myChart = echarts.init(document.getElementById("map1"));

        // 初始化地图的基本配置
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}'
            },
            visualMap: {
                min: 0,
                max: 1000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered']
                }
            },
            series: [{
                name: 'Netflix Titles Distribution by Country',
                type: 'map',
                mapType: 'world',
                roam: true,
                data: []
            }]
        });

        // 异步加载 JSON 数据
        $.getJSON('../cleaned_netflix_titles.json', function (data) {
            var countryDistribution = {};

            // 统计国家分布
            data.forEach(function (item) {
                var country = item.country || 'Unknown';
                country.split(', ').forEach(function (c) {
                    countryDistribution[c] = (countryDistribution[c] || 0) + 1;
                });
            });

            // 准备数据以用于 ECharts
            var processedData = [];
            for (var country in countryDistribution) {
                processedData.push({
                    name: country,
                    value: countryDistribution[country]
                });
            }

            myChart.setOption({
                series: [{
                    data: processedData
                }]
            });

            // 添加点击事件监听器
            myChart.on('click', function (params) {
                if (params.componentType === 'series') {
                    // params.name 包含被点击国家的名称
                    var url = 'area.html?country=' + encodeURIComponent(params.name);
                    window.location.href = url;
                }
            });

            window.addEventListener('resize', function () {
                myChart.resize();
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("An error occurred while loading the data:", errorThrown);
        });

        // 加载 ECharts 地图数据
        $.getScript('https://cdn.jsdelivr.net/npm/echarts/map/js/world.js', function () {
            myChart.hideLoading();
        });
    }

})
