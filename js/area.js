document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const countryName = urlParams.get('country');
    document.getElementById('country-name').innerText = countryName + '的Netflix数据可视化';

    d3.json('../cleaned_netflix_titles.json').then(data => {
        const countryData = data.filter(item => item.country && item.country.includes(countryName));

        setTimeout(() => createChart1(countryData), 0);
        setTimeout(() => createChart2(countryData), 100);
        setTimeout(() => createChart3(countryData), 200);
        setTimeout(() => createChart4(countryData), 300);
        setTimeout(() => createChart5(countryData), 400);
        setTimeout(() => createChart6(countryData), 500);
        setTimeout(() => createChart7(countryData), 600);
        setTimeout(() => createChart8(countryData), 700);
    });

    function createChart1(data) {
        var myChart = echarts.init(document.getElementById('chart1'));
        var movieCount = data.filter(item => item.type === 'Movie').length;
        var tvCount = data.filter(item => item.type === 'TV Show').length;

        myChart.setOption({
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center',
                textStyle: {
                    color: 'rgba(255,255,255,.6)',
                }
            },
            series: [
                {
                    name: 'Content Type',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: movieCount, name: 'Movies' },
                        { value: tvCount, name: 'TV Shows' }
                    ]
                }
            ]
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }


    function createChart2(data) {
        var myChart = echarts.init(document.getElementById('chart2'));
        var yearDistribution = {};

        data.forEach(function (item) {
            var year = item.release_year;
            yearDistribution[year] = (yearDistribution[year] || 0) + 1;
        });

        var years = Object.keys(yearDistribution).sort();
        var values = years.map(year => yearDistribution[year]);

        var dateList = years;
        var valueList = values;

        myChart.setOption({
            visualMap: [
                {
                    show: false,
                    type: 'continuous',
                    seriesIndex: 0,
                    min: 0,
                    max: Math.max(...valueList)
                }
            ],
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: dateList,
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
            series: [
                {
                    type: 'line',
                    showSymbol: false,
                    data: valueList,
                    itemStyle: {
                        color: '#33CFA5'
                    },
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#418DFD' },
                            { offset: 1, color: '#33CFA5' }
                        ])
                    }
                }
            ]
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }


    function createChart3(data) {
        var myChart = echarts.init(document.getElementById('chart3'));
        var genreCount = {};

        // 统计每个类型的数量
        data.forEach(function (item) {
            if (Array.isArray(item.genre)) {
                item.genre.forEach(function (genre) {
                    genreCount[genre] = (genreCount[genre] || 0) + 1;
                });
            }
        });

        // 准备Sunburst和Treemap图表数据
        var genreData = Object.keys(genreCount).map(function (genre) {
            return {
                name: genre,
                value: genreCount[genre]
            };
        });

        var chartData = [
            {
                name: 'Genres',
                children: genreData
            }
        ];

        const treemapOption = {
            series: [
                {
                    type: 'treemap',
                    id: 'genre-distribution',
                    animationDurationUpdate: 1000,
                    roam: false,
                    nodeClick: undefined,
                    data: chartData,
                    universalTransition: true,
                    label: {
                        show: true
                    },
                    breadcrumb: {
                        show: false
                    }
                }
            ]
        };

        const sunburstOption = {
            series: [
                {
                    type: 'sunburst',
                    id: 'genre-distribution',
                    radius: ['20%', '90%'],
                    animationDurationUpdate: 1000,
                    nodeClick: undefined,
                    data: chartData,
                    universalTransition: true,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,.5)'
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {c}'
                    }
                }
            ]
        };

        let currentOption = treemapOption;
        myChart.setOption(currentOption);

        setInterval(function () {
            currentOption = currentOption === treemapOption ? sunburstOption : treemapOption;
            myChart.setOption(currentOption);
        }, 3000);

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }

    function createChart4(data) {
        var myChart = echarts.init(document.getElementById('chart4'));
        var durations = [];

        // 统计所有电影的时长
        data.forEach(function (item) {
            if (item.type === 'Movie') {
                var duration = item.duration ? parseInt(item.duration) : NaN;
                if (!isNaN(duration)) {
                    durations.push(duration);
                }
            }
        });

        // 统计时长分布
        var durationCount = {};
        durations.forEach(function (duration) {
            if (!durationCount[duration]) {
                durationCount[duration] = 0;
            }
            durationCount[duration]++;
        });

        var dataForScatter = Object.keys(durationCount).map(function (key) {
            return [parseInt(key), durationCount[key]];
        });

        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return '时长: ' + params.data[0] + ' 分钟<br/>数量: ' + params.data[1];
                }
            },
            xAxis: {
                type: 'value',
                name: '时长 (分钟)',
                nameLocation: 'middle',
                nameGap: 30,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255,255,255,1)'
                }
            },
            yAxis: {
                type: 'value',
                show: false
            },
            series: [
                {
                    name: '电影时长分布',
                    type: 'scatter',
                    symbolSize: function (data) {
                        return data[1] * 2; // 数量越多，点越大
                    },
                    data: dataForScatter,
                    itemStyle: {
                        color: '#33CFA5'
                    }
                }
            ]
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }



    function createChart5(data) {
        var myChart = echarts.init(document.getElementById('chart5'));
        var descriptions = [];

        // 收集所有描述
        data.forEach(function (item) {
            if (item.description) {
                descriptions.push(item.description);
            }
        });

        // 提取关键词并计算词频
        var wordCounts = {};
        var stopWords = ['into', 'k', 's', 'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'with', 'by', 'for', 'about', 'as', 'of', 'to', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'that', 'this', 'it', 'he', 'she', 'they', 'them', 'his', 'her', 'its', 'their', 'but', 'if', 'then', 'which', 'who', 'whom', 'whose', 'because', 'so', 'thus', 'therefore', 'such', 'has', 'have', 'had', 'do', 'does', 'did', 'can', 'could', 'shall', 'should', 'will', 'would', 'may', 'might', 'must', 'we', 'you', 'i', 'me', 'my', 'mine', 'your', 'yours', 'our', 'ours', 'their', 'theirs', 'him', 'her', 'us', 'these', 'those', 'what', 'which', 'when', 'where', 'why', 'how', 'many', 'much', 'more', 'most', 'some', 'any', 'each', 'every', 'both', 'all', 'few', 'several', 'one', 'two', 'three', 'four', 'five', 'first', 'second', 'next', 'last', 'other', 'another', 'same', 'new', 'just', 'only', 'own', 'even', 'such', 'quite', 'rather', 'really', 'like', 'too', 'very', 'not', 'no', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'where', 'when', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'];

        descriptions.forEach(function (description) {
            var words = description.split(/\W+/);
            words.forEach(function (word) {
                word = word.toLowerCase();
                if (word && !stopWords.includes(word)) {
                    if (!wordCounts[word]) {
                        wordCounts[word] = 0;
                    }
                    wordCounts[word]++;
                }
            });
        });

        // 过滤掉频数为1的词
        var filteredWordCloudData = Object.keys(wordCounts).filter(function (key) {
            return wordCounts[key] > 1;
        }).map(function (key) {
            return {
                name: key,
                value: wordCounts[key]
            };
        });

        // 获取词频的最大值和最小值
        var maxFrequency = Math.max(...filteredWordCloudData.map(function (item) {
            return item.value;
        }));
        var minFrequency = Math.min(...filteredWordCloudData.map(function (item) {
            return item.value;
        }));

        // 定义颜色数组，颜色按频率分布
        var colors = ['#00aaff', '#00ff00', '#ffaa00', '#ff0000', '#ff00ff'];

        // 定义颜色分配函数
        function getColor(frequency) {
            var range = (maxFrequency - minFrequency) / (colors.length - 1);
            var index = Math.floor((frequency - minFrequency) / range);
            return colors[index];
        }

        myChart.setOption({
            tooltip: {
                show: true
            },
            series: [{
                type: 'wordCloud',
                gridSize: 2,
                sizeRange: [10, 100],  // 调整字体大小范围
                rotationRange: [-45, 45],  // 调整旋转范围
                shape: 'circle',  // 改为圆形布局
                width: '100%',
                height: '100%',
                drawOutOfBound: false,
                textStyle: {
                    normal: {
                        color: function (params) {
                            return getColor(params.data.value);
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: filteredWordCloudData
            }]
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }


    function createChart6(data) {
        var myChart = echarts.init(document.getElementById('chart6'));

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

        var option = {
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
                data: ratingOrder,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: 30,
                    color: 'rgba(255,255,255,1)'
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
            series: [
                {
                    name: 'Movies',
                    type: 'bar',
                    itemStyle: {
                        color: '#418DFD'  // 蓝色
                    },
                    data: movieRatingsData
                },
                {
                    name: 'TV Shows',
                    type: 'bar',
                    itemStyle: {
                        color: '#33CFA5'  // 绿色
                    },
                    data: tvRatingsData
                }
            ]
        };

        myChart.setOption(option);

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }

    function createChart7(data) {
        var myChart = echarts.init(document.getElementById('chart7'));
        var monthCount = Array(12).fill(0);

        // 将月份名称映射到数组索引
        var monthMap = {
            'January': 0,
            'February': 1,
            'March': 2,
            'April': 3,
            'May': 4,
            'June': 5,
            'July': 6,
            'August': 7,
            'September': 8,
            'October': 9,
            'November': 10,
            'December': 11
        };

        // 统计每个月的数量
        data.forEach(function (item) {
            if (item.month_added) {
                var monthIndex = monthMap[item.month_added];
                if (monthIndex !== undefined) {
                    monthCount[monthIndex]++;
                }
            }
        });

        var option = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255,255,255,1)'
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
                    lineStyle: {
                        color: 'rgba(0,0,0,.1)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255,255,255,1)'
                }
            },
            series: [
                {
                    name: 'New Additions',
                    type: 'line',
                    data: monthCount,
                    itemStyle: {
                        color: '#33CFA5'
                    },
                    lineStyle: {
                        color: '#33CFA5'
                    }
                }
            ]
        };

        myChart.setOption(option);

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }

    function createChart8(data) {
        var myChart = echarts.init(document.getElementById('chart8'));
        var seasons = [];

        // 统计所有TV节目的季数
        data.forEach(function (item) {
            if (item.type === 'TV Show') {
                var season = item.duration ? parseInt(item.duration) : NaN;
                if (!isNaN(season)) {
                    seasons.push(season);
                }
            }
        });

        // 统计季数分布
        var seasonCount = {};
        seasons.forEach(function (season) {
            if (!seasonCount[season]) {
                seasonCount[season] = 0;
            }
            seasonCount[season]++;
        });

        var dataForScatter = Object.keys(seasonCount).map(function (key) {
            return [parseInt(key), seasonCount[key]];
        });

        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return '季数: ' + params.data[0] + ' 季<br/>数量: ' + params.data[1];
                }
            },
            xAxis: {
                type: 'value',
                name: '季数',
                nameLocation: 'middle',
                nameGap: 30,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255,255,255,1)'
                }
            },
            yAxis: {
                type: 'value',
                show: false
            },
            series: [
                {
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[1]) * 2;
                    },
                    data: dataForScatter,
                    itemStyle: {
                        color: '#33CFA5'
                    }
                }
            ]
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }
});
