# carbonDviz
一个关于碳中和的数据可视化项目   

## 数据格式说明

1. `data/1-title.json` 标题数据
    ~~~json
    {
        "ratio": 300   // 城市的一年相当于森林的多少年
    }
    ~~~

2. `data/2-map-line-info.json` 地图 + 折线图 + 汇聚成一个轴
    ~~~json
    {
        "country-data": [                                           // 每个国家的数据
            {
                "country-name": "中国",                             // 国家名称
                "ddl-time": 2035,                                   // 计划碳中和的事件
                "policy": "政策的文字",                              // 政策的具体说明
                "carbon": [                                         // 每年的碳排放量
                    { "year": 1960, "value": 300 },                 // 年 + 值
                    { "year": 1960, "value": 300 }
                ], 
                "map-events": [                                     // 该国家的事件 - 地图
                    { "year": 1975, "detail": "事件的细节描述" },    // 年 + 事件详情
                    { "year": 1987, "detail": "事件的细节描述" }
                ], 
                "line-events": [                                    // 该国家的事件 - 折线图
                    { "year": 1975, "detail": "事件的细节描述" },    // 年 + 事件详情
                    { "year": 1987, "detail": "事件的细节描述" }
                ]
            }, {
                "country-name": "美国", 
                "ddl-time": 2040, 
                "policy": "政策的文字", 
                "carbon": [
                    { "year": 1960, "value": 300 }, 
                    { "year": 1960, "value": 300 }
                ], 
                "map-events": [
                    { "year": 1975, "detail": "事件的细节描述" }, 
                    { "year": 1987, "detail": "事件的细节描述" }
                ], 
                "line-events": [
                    { "year": 1975, "detail": "事件的细节描述" }, 
                    { "year": 1987, "detail": "事件的细节描述" }
                ]
            }
        ], 
        "global-data": {                                            // 全局事件
            "map-events": [                                         // 地图事件
                { "year": 1975, "detail": "事件的细节描述" },        // 年 + 事件详情
                { "year": 1987, "detail": "事件的细节描述" }
            ], 
            "line-events": [                                        // 折线图事件
                { "year": 1975, "detail": "事件的细节描述" },        // 年 + 事件详情
                { "year": 1987, "detail": "事件的细节描述" }
            ]
        }
    }
    ~~~

3. `data/3-policy-word-freq.json` 政策词频统计
    ~~~json
    {
        "data": [                                        // 词频数据部分
            {
                "year": 2019,                            // 年份
                "words": [                               // 词列表
                    { "name": "争议", "value": 123 },    // 词 + 词频
                    { "name": "平等", "value": 123 },
                    { "name": "法制", "value": 123 },
                    { "name": "争议", "value": 123 }
                ]
            }, {
                "year": 2020,
                "words": [
                    { "name": "争议", "value": 123 }, 
                    { "name": "平等", "value": 123 },
                    { "name": "法制", "value": 123 },
                    { "name": "争议", "value": 123 }
                ]
            }
        ]
    }
    ~~~

4. `data/4-china-transaction-data.json` 碳排量交易数据
    ~~~json
    {
        "data": [                                                   // 交易所数据
            {
                "name": "北京环保交易所",                            // 交易所名称
                "data": [                                           // 交易所详细数据
                    { "year": 2013, "month": 1, "value": 20000 },   // 年 + 月 + 值
                    { "year": 2013, "month": 2, "value": 20030 }
                ]
            }, {
                "name": "深圳交易所", 
                "data": [
                    { "year": 2013, "month": 1, "value": 20000 }, 
                    { "year": 2013, "month": 2, "value": 20030 }
                ]
            }
        ]
    }
    ~~~

5. `data/5-gdp-carbon.json` 人均 GDP + 人均碳排量
    ~~~json
    {
        "data": [                                                      // 数据部分
            {
                "country": "中国",                                      // 国家名称
                "data": [                                               // 国家详细数据
                    { "year": 2013, "gdp": 156324132, "carbon": 251 },  // 年 + 人均GDP + 人均碳排量
                    { "year": 2014, "gdp": 198564354, "carbon": 230 }
                ]
            }, {
                "country": "某国", 
                "data": [
                    { "year": 2013, "gdp": 156324132, "carbon": 251 }, 
                    { "year": 2014, "gdp": 198564354, "carbon": 230 }
                ]
            }
        ]
    }
    ~~~