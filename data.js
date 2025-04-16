const carData = {
    "Audi": {
        "A4": {
            "2020": [
                { name: "2.0 TFSI", cost: 35000 },
                { name: "3.0 TDI", cost: 42000 }
            ],
            "2021": [
                { name: "2.0 TFSI", cost: 36000 },
                { name: "3.0 TDI", cost: 43000 },
                { name: "40 TFSI", cost: 38000 }
            ],
            "2022": [
                {
                    name: "45 TFSI",
                    stockParams: {
                        volume: "1984 см³",
                        power: "249 лс",
                        torque: "370 нм",
                        accel: "5.8 сек"
                    },
                    stages: [
                        {
                            stage: "Stage 1",
                            cost: 41000, // Базовая стоимость Stage 1
                            tunedParams: {
                                power: "310 лс",
                                torque: "450 нм",
                                accel: "5.1 сек"
                                // Объем обычно не меняется при чип-тюнинге
                            },
                            availableOptions: [
                                { id: "speed_lim_off", name: "Снятие ограничения скорости", cost: 5000 },
                                { id: "cat_off", name: "Отключение контроля катализаторов", cost: 8000 },
                                { id: "start_stop_off", name: "Отключение функции Start/Stop", cost: 3000 }
                            ]
                        },
                        {
                            stage: "Stage 2",
                            cost: 65000, // Базовая стоимость Stage 2
                            tunedParams: {
                                power: "340 лс",
                                torque: "490 нм",
                                accel: "4.8 сек"
                            },
                            availableOptions: [
                                { id: "speed_lim_off", name: "Снятие ограничения скорости", cost: 5000 },
                                { id: "cat_off", name: "Отключение контроля катализаторов", cost: 8000 },
                                { id: "start_stop_off", name: "Отключение функции Start/Stop", cost: 3000 },
                                { id: "downpipe", name: "Установка даунпайпа (рекомендуется)", cost: 25000 }
                            ]
                        }
                        // Можно добавить Stage 3 и т.д.
                    ]
                },
                {
                    // Данные для 50 TDI (пример без Stage 2 и с другими опциями)
                    name: "50 TDI",
                     stockParams: { volume: "2967 см³", power: "286 лс", torque: "620 нм", accel: "5.5 сек" },
                     stages: [
                         {
                            stage: "Stage 1",
                            cost: 48000,
                            tunedParams: { power: "330 лс", torque: "700 нм", accel: "5.0 сек" },
                            availableOptions: [
                                { id: "speed_lim_off", name: "Снятие ограничения скорости", cost: 5000 },
                                { id: "dpf_off", name: "Отключение сажевого фильтра", cost: 10000 },
                                { id: "egr_off", name: "Отключение EGR", cost: 7000 }
                            ]
                        }
                    ]
                }
            ]
        },
        "A6": {
            "2019": [
                // { name: "2.0 TFSI", cost: 40000 }, // Старая структура, нужно обновить
                // { name: "3.0 TFSI", cost: 48000 },
                // { name: "3.0 TDI", cost: 46000 }
                 //TODO: Обновить структуру для A6 2019
            ],
            "2020": [
                //TODO: Обновить структуру для A6 2020
            ],
            "2021": [
                //TODO: Обновить структуру для A6 2021
            ]
        },
        "Q5": {
            "2020": [
                 //TODO: Обновить структуру для Q5 2020
            ],
             "2021": [
                 //TODO: Обновить структуру для Q5 2021
            ],
             "2022": [
                 //TODO: Обновить структуру для Q5 2022
             ]
        }
    }
    // Добавьте сюда другие марки по аналогии
    // "BMW": { ... },
    // "Mercedes": { ... }
}; 