/*
 * Michael's Foundations — Conversation content
 * Six new character-led experiences. Edit dialogue and explanations here.
 * Each answer has a response intent; branches use those intents.
 * The learner speaks the answer; answer cards are suggestions, not buttons.
 */

const answer = (russian, english, intent, level = 'Natural') => ({
    russian,
    english,
    intent,
    level
});

const word = (russian, english) => ({ russian, english });

const turn = (russian, english, answers, meanings, discovery, next) => ({
    russian,
    english,
    answers,
    meanings,
    discovery,
    next
});

export const conversations = {
    anna: {
    "character": "Anna",
    "scenario": "Scenario One – Family Dinner",
    "portrait": "anna-portrait.png",
    "start": "opening",
    "turns": {
        "opening": {
            "russian": "Ты любишь борщ?",
            "english": "Do you like borscht?",
            "answers": [
                {
                    "russian": "Да, я люблю борщ.",
                    "english": "Yes, I like borscht.",
                    "intent": "yes",
                    "level": "Simple"
                },
                {
                    "russian": "Да, очень люблю!",
                    "english": "Yes, I like it very much!",
                    "intent": "yes",
                    "level": "Expanded"
                },
                {
                    "russian": "Обожаю борщ!",
                    "english": "I love borscht!",
                    "intent": "yes",
                    "level": "Natural"
                },
                {
                    "russian": "Нет, я не люблю борщ.",
                    "english": "No, I don’t like borscht.",
                    "intent": "no",
                    "level": "Simple"
                },
                {
                    "russian": "Нет, не очень.",
                    "english": "No, not really.",
                    "intent": "no",
                    "level": "Natural"
                },
                {
                    "russian": "Я никогда не пробовал борщ.",
                    "english": "I’ve never tried borscht. (male speaker)",
                    "intent": "unknown",
                    "level": "Challenge"
                },
                {
                    "russian": "А что такое борщ?",
                    "english": "What is borscht?",
                    "intent": "what",
                    "level": "Curious"
                }
            ],
            "meanings": [
                {
                    "russian": "Ты",
                    "english": "You — informal, for someone you know well."
                },
                {
                    "russian": "любишь",
                    "english": "You like / love — the ты form of любить."
                },
                {
                    "russian": "борщ",
                    "english": "Borscht, a beet-based soup."
                }
            ],
            "discovery": {
                "title": "How the verb changes",
                "intro": "Russian verbs change depending on who is doing the action.",
                "forms": [
                    [
                        "Я люб<span class=\"ending\">лю</span>",
                        "I like"
                    ],
                    [
                        "Ты люб<span class=\"ending\">ишь</span>",
                        "You like"
                    ]
                ],
                "note": "The ending tells us who likes something. Listen for the change.",
                "quiz": [
                    "How would you say “I like”?",
                    "Я люблю",
                    "Ты любишь"
                ]
            },
            "next": {
                "yes": "yes",
                "no": "no",
                "unknown": "unknown",
                "what": "what"
            }
        },
        "yes": {
            "russian": "Замечательно! Хочешь ещё борща?",
            "english": "Wonderful! Would you like some more borscht?",
            "answers": [
                {
                    "russian": "Да, хочу ещё.",
                    "english": "Yes, I want more.",
                    "intent": "yes",
                    "level": "Simple"
                },
                {
                    "russian": "Да, я хочу ещё борща.",
                    "english": "Yes, I want more borscht.",
                    "intent": "yes",
                    "level": "Expanded"
                },
                {
                    "russian": "Да, пожалуйста, дай мне ещё.",
                    "english": "Yes, please, give me some more.",
                    "intent": "yes",
                    "level": "Natural"
                },
                {
                    "russian": "Можно немного борща?",
                    "english": "May I have a little borscht?",
                    "intent": "yes",
                    "level": "Challenge"
                },
                {
                    "russian": "Нет, спасибо.",
                    "english": "No, thank you.",
                    "intent": "no",
                    "level": "Simple"
                },
                {
                    "russian": "Нет, я больше не хочу.",
                    "english": "No, I don’t want any more.",
                    "intent": "no",
                    "level": "Expanded"
                },
                {
                    "russian": "Спасибо, я уже сыт.",
                    "english": "Thanks, I’m already full. (male speaker)",
                    "intent": "no",
                    "level": "Natural"
                },
                {
                    "russian": "Спасибо, я уже сыта.",
                    "english": "Thanks, I’m already full. (female speaker)",
                    "intent": "no",
                    "level": "Natural"
                }
            ],
            "meanings": [
                {
                    "russian": "Хочешь",
                    "english": "Do you want? Informal ты form of хотеть."
                },
                {
                    "russian": "ещё",
                    "english": "More / another serving, in this context."
                },
                {
                    "russian": "борща",
                    "english": "Of borscht — a genitive form of борщ, used with an unspecified amount."
                }
            ],
            "discovery": {
                "title": "A little more borscht",
                "intro": "When we talk about an unspecified amount, Russian often uses the genitive.",
                "forms": [
                    [
                        "борщ",
                        "borscht"
                    ],
                    [
                        "ещё борщ<span class=\"ending\">а</span>",
                        "more borscht"
                    ]
                ],
                "note": "The noun changes: борщ → борща. Also notice дай (informal) versus дайте (polite/plural).",
                "quiz": [
                    "Which means “more borscht”?",
                    "ещё борща",
                    "ещё борщ"
                ]
            },
            "next": {
                "yes": "moreYes",
                "no": "moreNo"
            }
        },
        "no": {
            "russian": "Понятно. А что ты любишь?",
            "english": "I see. And what do you like?",
            "answers": [
                {
                    "russian": "Я люблю пельмени.",
                    "english": "I like pelmeni.",
                    "intent": "pelmeni",
                    "level": "Simple"
                },
                {
                    "russian": "Мне нравится суп.",
                    "english": "I like soup.",
                    "intent": "soup",
                    "level": "Expanded"
                },
                {
                    "russian": "Я люблю пироги.",
                    "english": "I like pies.",
                    "intent": "pies",
                    "level": "Expanded"
                },
                {
                    "russian": "Я люблю картошку.",
                    "english": "I like potatoes.",
                    "intent": "potatoes",
                    "level": "Natural"
                },
                {
                    "russian": "Я предпочитаю салат.",
                    "english": "I prefer salad.",
                    "intent": "salad",
                    "level": "Challenge"
                },
                {
                    "russian": "А что ты любишь?",
                    "english": "And what do you like?",
                    "intent": "ask",
                    "level": "Curious"
                }
            ],
            "meanings": [
                {
                    "russian": "А",
                    "english": "And / but — often shifts or contrasts the topic."
                },
                {
                    "russian": "что",
                    "english": "What."
                },
                {
                    "russian": "ты любишь",
                    "english": "You like — informal."
                }
            ],
            "discovery": {
                "title": "Two ways to say “I like”",
                "intro": "Both are natural Russian, but they are built differently.",
                "forms": [
                    [
                        "Я люб<span class=\"ending\">лю</span> суп.",
                        "I like soup."
                    ],
                    [
                        "Мне нрав<span class=\"ending\">ится</span> суп.",
                        "I like soup."
                    ]
                ],
                "note": "Мне нравится literally follows a “pleases me” pattern. With a plural subject: Мне нравятся пельмени.",
                "quiz": [
                    "Which expression means “I like soup”?",
                    "Мне нравится суп.",
                    "Мне нравятся суп."
                ]
            },
            "next": {
                "pelmeni": "preference",
                "soup": "preference",
                "pies": "preference",
                "potatoes": "preference",
                "salad": "preference",
                "ask": "preference"
            }
        },
        "unknown": {
            "russian": "Тогда попробуй! Это очень вкусно.",
            "english": "Then give it a try! It’s very tasty.",
            "answers": [
                {
                    "russian": "Хорошо, попробую.",
                    "english": "Okay, I’ll try it.",
                    "intent": "yes",
                    "level": "Simple"
                },
                {
                    "russian": "Спасибо, попробую немного.",
                    "english": "Thanks, I’ll try a little.",
                    "intent": "yes",
                    "level": "Expanded"
                },
                {
                    "russian": "Нет, спасибо.",
                    "english": "No, thank you.",
                    "intent": "no",
                    "level": "Simple"
                }
            ],
            "meanings": [
                {
                    "russian": "попробуй",
                    "english": "Try it! Informal singular imperative of попробовать."
                },
                {
                    "russian": "вкусно",
                    "english": "Tasty / delicious."
                }
            ],
            "discovery": {
                "title": "A friendly invitation",
                "intro": "The imperative is not always a harsh command. It can be a warm invitation.",
                "forms": [
                    [
                        "Попробу<span class=\"ending\">й</span>!",
                        "Try it! (informal)"
                    ],
                    [
                        "Попробу<span class=\"ending\">йте</span>!",
                        "Try it! (polite/plural)"
                    ]
                ],
                "note": "The polite or plural form adds -те.",
                "quiz": [
                    "Which would you say to several guests?",
                    "Попробуйте!",
                    "Попробуй!"
                ]
            },
            "next": {
                "yes": "moreYes",
                "no": "moreNo"
            }
        },
        "what": {
            "russian": "Борщ — это суп со свёклой. Хочешь попробовать?",
            "english": "Borscht is a soup with beets. Would you like to try it?",
            "answers": [
                {
                    "russian": "Да, хочу попробовать.",
                    "english": "Yes, I want to try it.",
                    "intent": "yes",
                    "level": "Simple"
                },
                {
                    "russian": "Да, пожалуйста.",
                    "english": "Yes, please.",
                    "intent": "yes",
                    "level": "Simple"
                },
                {
                    "russian": "Нет, спасибо.",
                    "english": "No, thank you.",
                    "intent": "no",
                    "level": "Simple"
                }
            ],
            "meanings": [
                {
                    "russian": "Что такое…?",
                    "english": "What is …? A very useful question for unfamiliar words."
                },
                {
                    "russian": "суп со свёклой",
                    "english": "Soup with beets."
                },
                {
                    "russian": "попробовать",
                    "english": "To try / taste (perfective infinitive)."
                }
            ],
            "discovery": {
                "title": "Ask about anything",
                "intro": "Что такое…? is a powerful question when you encounter a new word.",
                "forms": [
                    [
                        "Что такое борщ?",
                        "What is borscht?"
                    ],
                    [
                        "Что такое пельмени?",
                        "What are pelmeni?"
                    ]
                ],
                "note": "Use this pattern to keep the conversation going even when you don’t know a word.",
                "quiz": [
                    "How do you ask “What is pelmeni?”",
                    "Что такое пельмени?",
                    "Ты пельмени?"
                ]
            },
            "next": {
                "yes": "moreYes",
                "no": "moreNo"
            }
        },
        "moreYes": {
            "russian": "Конечно! Угощайся!",
            "english": "Of course! Help yourself!",
            "answers": [
                {
                    "russian": "Спасибо!",
                    "english": "Thank you!",
                    "intent": "thanks",
                    "level": "Simple"
                },
                {
                    "russian": "Большое спасибо!",
                    "english": "Thank you very much!",
                    "intent": "thanks",
                    "level": "Expanded"
                },
                {
                    "russian": "С удовольствием!",
                    "english": "With pleasure!",
                    "intent": "thanks",
                    "level": "Natural"
                },
                {
                    "russian": "Как вкусно!",
                    "english": "How delicious!",
                    "intent": "thanks",
                    "level": "Natural"
                }
            ],
            "meanings": [
                {
                    "russian": "угощайся",
                    "english": "A friendly invitation to enjoy food or drink offered by a host."
                },
                {
                    "russian": "угощаться",
                    "english": "Imperfective reflexive infinitive: to help oneself / enjoy a treat."
                },
                {
                    "russian": "угоститься",
                    "english": "Related perfective infinitive."
                }
            ],
            "discovery": {
                "title": "An invitation, not an order",
                "intro": "Russian changes the invitation depending on whom you address.",
                "forms": [
                    [
                        "Угоща<span class=\"ending\">йся</span>!",
                        "One person, informal"
                    ],
                    [
                        "Угоща<span class=\"ending\">йтесь</span>!",
                        "Polite or several people"
                    ]
                ],
                "note": "The informal imperative comes from угощаться. The polite/plural form is угощайтесь. The highlighted forms show the contrast.",
                "quiz": [
                    "You are welcoming several guests. Which fits?",
                    "Угощайтесь!",
                    "Угощайся!"
                ]
            },
            "next": {
                "thanks": "closing"
            }
        },
        "moreNo": {
            "russian": "Хорошо! Если захочешь, скажи.",
            "english": "All right! Let me know if you want some.",
            "answers": [
                {
                    "russian": "Спасибо!",
                    "english": "Thank you!",
                    "intent": "thanks",
                    "level": "Simple"
                },
                {
                    "russian": "Хорошо, спасибо.",
                    "english": "Okay, thank you.",
                    "intent": "thanks",
                    "level": "Expanded"
                },
                {
                    "russian": "Обязательно!",
                    "english": "Certainly! / I will!",
                    "intent": "thanks",
                    "level": "Natural"
                }
            ],
            "meanings": [
                {
                    "russian": "если",
                    "english": "If."
                },
                {
                    "russian": "захочешь",
                    "english": "You come to want / will want — perfective future of захотеть."
                },
                {
                    "russian": "скажи",
                    "english": "Tell me / say — informal imperative of сказать."
                }
            ],
            "discovery": {
                "title": "A gentle conditional",
                "intro": "Anna leaves the invitation open.",
                "forms": [
                    [
                        "Хоч<span class=\"ending\">ешь</span>?",
                        "Do you want?"
                    ],
                    [
                        "За<span class=\"ending\">хочешь</span> — скажи.",
                        "If you want to — tell me."
                    ]
                ],
                "note": "The prefix за- helps create the perfective verb захотеть. The meaning is not just a changed ending.",
                "quiz": [
                    "Which word means “if”?",
                    "если",
                    "скажи"
                ]
            },
            "next": {
                "thanks": "closing"
            }
        },
        "preference": {
            "russian": "Как интересно! Спасибо, что поделился!",
            "english": "How interesting! Thanks for sharing!",
            "answers": [
                {
                    "russian": "Пожалуйста!",
                    "english": "You’re welcome!",
                    "intent": "thanks",
                    "level": "Simple"
                },
                {
                    "russian": "Спасибо!",
                    "english": "Thank you!",
                    "intent": "thanks",
                    "level": "Simple"
                },
                {
                    "russian": "А ты что любишь?",
                    "english": "And what do you like?",
                    "intent": "ask",
                    "level": "Curious"
                }
            ],
            "meanings": [
                {
                    "russian": "спасибо, что…",
                    "english": "Thank you for … / Thanks that …"
                },
                {
                    "russian": "поделился",
                    "english": "Shared — masculine past-tense form."
                },
                {
                    "russian": "поделилась",
                    "english": "Shared — feminine past-tense form."
                }
            ],
            "discovery": {
                "title": "Past tense can change",
                "intro": "Russian past-tense verbs can reflect the gender of the person being described.",
                "forms": [
                    [
                        "подели<span class=\"ending\">лся</span>",
                        "Masculine"
                    ],
                    [
                        "подели<span class=\"ending\">лась</span>",
                        "Feminine"
                    ]
                ],
                "note": "Anna’s prototype currently uses one fixed form. Later we can make it adapt to the learner.",
                "quiz": [
                    "Which form is feminine?",
                    "поделилась",
                    "поделился"
                ]
            },
            "next": {
                "thanks": "closing",
                "ask": "closing"
            }
        },
        "closing": {
            "russian": "Спасибо за разговор! До скорого!",
            "english": "Thanks for the conversation! See you soon!",
            "answers": [],
            "meanings": [
                {
                    "russian": "до",
                    "english": "Until / up to. Here: “until.”"
                },
                {
                    "russian": "скорого",
                    "english": "Genitive singular form of the adjective скорый — soon / near / forthcoming."
                },
                {
                    "russian": "скоро",
                    "english": "The separate adverb “soon.” It is NOT the word form used in this farewell."
                }
            ],
            "discovery": {
                "title": "Why скорого?",
                "intro": "До скорого! is a shortened farewell, traditionally understood as До скорого свидания! (“Until we meet again soon”).",
                "forms": [
                    [
                        "скор<span class=\"ending\">ый</span>",
                        "Basic masculine adjective"
                    ],
                    [
                        "скор<span class=\"ending\">ого</span>",
                        "Genitive adjective after до"
                    ]
                ],
                "note": "До takes the genitive case. Скорого agrees with the understood noun свидания (also genitive). The everyday expression is simply До скорого! Compare До завтра! and До встречи!",
                "quiz": [
                    "Which is the natural farewell?",
                    "До скорого!",
                    "До скоро!"
                ]
            },
            "next": {}
        }
    }
},

    dmitri: {
        character: 'Dmitri',
        scenario: 'Scenario Two – Planning Dinner',
        portrait: 'dmitri-portrait.png',
        start: 'opening',
        turns: {
            opening: turn(
                'Что будем готовить на ужин?',
                'What shall we cook for dinner?',
                [
                    answer('Давай приготовим суп.', 'Let’s make soup.', 'soup', 'Simple'),
                    answer('Я хочу приготовить пельмени.', 'I want to make pelmeni.', 'pelmeni', 'Expanded'),
                    answer('Может быть, сделаем салат?', 'Maybe we could make a salad?', 'salad', 'Natural'),
                    answer('А что ты предлагаешь?', 'What do you suggest?', 'ask', 'Challenge')
                ],
                [word('что', 'what'), word('будем', 'we will / shall'), word('готовить', 'to cook, prepare'), word('на ужин', 'for dinner')],
                {
                    title: 'A plan made together',
                    intro: 'Будем + infinitive suggests a shared future activity.',
                    forms: [['Мы буд<span class="ending">ем</span> готовить.', 'We will cook.'], ['Я буд<span class="ending">у</span> готовить.', 'I will cook.']],
                    note: 'The ending of быть changes with the person. Готовить stays in the infinitive.',
                    quiz: ['How do you say “We will cook”?', 'Мы будем готовить.', 'Я буду готовить.']
                },
                { soup: 'ingredients', pelmeni: 'ingredients', salad: 'ingredients', ask: 'suggestion' }
            ),
            suggestion: turn(
                'Я предлагаю приготовить что-нибудь простое. Например, картошку.',
                'I suggest making something simple. Potatoes, for example.',
                [
                    answer('Отличная идея!', 'Great idea!', 'agree', 'Simple'),
                    answer('Давай приготовим картошку.', 'Let’s make potatoes.', 'agree', 'Expanded'),
                    answer('Лучше приготовим суп.', 'Let’s make soup instead.', 'change', 'Natural'),
                    answer('Почему именно картошку?', 'Why potatoes specifically?', 'ask', 'Challenge')
                ],
                [word('предлагаю', 'I suggest'), word('что-нибудь', 'something'), word('простое', 'simple, neuter form'), word('лучше', 'better / rather')],
                {
                    title: 'A small word, a big choice',
                    intro: 'Russian adjectives change to agree with the noun or pronoun they describe.',
                    forms: [['прост<span class="ending">ой</span> ужин', 'a simple dinner'], ['что-нибудь прост<span class="ending">ое</span>', 'something simple']],
                    note: 'Простое is neuter here because что-нибудь takes a neuter adjective.',
                    quiz: ['Which means “something simple”?', 'что-нибудь простое', 'что-нибудь простой']
                },
                { agree: 'ingredients', change: 'ingredients', ask: 'ingredients' }
            ),
            ingredients: turn(
                'Хорошо! Какие продукты у нас есть дома?',
                'Good! What ingredients do we have at home?',
                [
                    answer('У нас есть картошка.', 'We have potatoes.', 'have', 'Simple'),
                    answer('Есть лук и морковь.', 'There are onions and carrots.', 'have', 'Expanded'),
                    answer('Нужно купить продукты.', 'We need to buy groceries.', 'buy', 'Natural'),
                    answer('Давай проверим холодильник.', 'Let’s check the refrigerator.', 'check', 'Challenge')
                ],
                [word('какие', 'which / what kind of (plural)'), word('продукты', 'food products / groceries'), word('у нас есть', 'we have'), word('дома', 'at home')],
                {
                    title: 'What do we have?',
                    intro: 'The common Russian pattern for possession is у + person + есть.',
                    forms: [['У нас <span class="ending">есть</span> картошка.', 'We have potatoes.'], ['У меня <span class="ending">есть</span> лук.', 'I have an onion.']],
                    note: 'У нас means “at our place / with us.” Есть states that something exists or is available.',
                    quiz: ['Which means “We have potatoes”?', 'У нас есть картошка.', 'Мы есть картошка.']
                },
                { have: 'closing', buy: 'closing', check: 'closing' }
            ),
            closing: turn('Отлично! Тогда начнём готовить. До встречи!', 'Great! Then let’s start cooking. See you!', [],
                [word('тогда', 'then / in that case'), word('начнём', 'we will begin'), word('до встречи', 'see you / until we meet')],
                {
                    title: 'A natural farewell',
                    intro: 'До is followed by the genitive case in these farewell expressions.',
                    forms: [['встреч<span class="ending">а</span>', 'a meeting'], ['до встреч<span class="ending">и</span>', 'until we meet']],
                    note: 'The noun встреча changes to встречи after до.',
                    quiz: ['Which means “See you”?', 'До встречи!', 'До встреча!']
                }, {})
        }
    },

    amina: {
        character: 'Amina',
        scenario: 'Scenario Three – Grocery Shopping',
        portrait: 'amina-portrait.png',
        start: 'opening',
        turns: {
            opening: turn('Нам нужны помидоры. Сколько возьмём?', 'We need tomatoes. How many shall we take?', [
                answer('Два помидора.', 'Two tomatoes.', 'two', 'Simple'),
                answer('Давай возьмём три.', 'Let’s take three.', 'three', 'Expanded'),
                answer('Нам нужен только один.', 'We only need one.', 'one', 'Natural'),
                answer('А сколько стоит килограмм?', 'And how much does a kilogram cost?', 'price', 'Challenge')
            ], [word('нам', 'to us / for us'), word('нужны', 'are needed (plural)'), word('сколько', 'how many / how much'), word('возьмём', 'we will take')], {
                title: 'One or many?', intro: 'Нужен changes to match the thing that is needed.',
                forms: [['Нуж<span class="ending">ен</span> помидор.', 'One tomato is needed.'], ['Нужн<span class="ending">ы</span> помидоры.', 'Tomatoes are needed.']],
                note: 'The form agrees with the noun: masculine singular нужен, plural нужны.',
                quiz: ['Which is correct for several tomatoes?', 'Нужны помидоры.', 'Нужен помидоры.']
            }, { two: 'quantity', three: 'quantity', one: 'quantity', price: 'price' }),
            price: turn('Килограмм стоит двести рублей. Это нормально?', 'A kilogram costs two hundred rubles. Is that reasonable?', [
                answer('Да, нормально.', 'Yes, that’s fine.', 'agree', 'Simple'),
                answer('Это слишком дорого.', 'That’s too expensive.', 'expensive', 'Natural'),
                answer('Давай купим полкилограмма.', 'Let’s buy half a kilogram.', 'half', 'Challenge'),
                answer('А есть что-нибудь дешевле?', 'Is there anything cheaper?', 'cheaper', 'Challenge')
            ], [word('стоит', 'costs'), word('рублей', 'rubles (genitive plural)'), word('дорого', 'expensive'), word('дешевле', 'cheaper')], {
                title: 'Rubles change form', intro: 'Russian numbers affect the form of the noun рубль.',
                forms: [['один рубл<span class="ending">ь</span>', 'one ruble'], ['два рубл<span class="ending">я</span>', 'two rubles'], ['пять рубл<span class="ending">ей</span>', 'five rubles']],
                note: 'Numbers ending in 1, 2–4, and 5–0 often require different noun forms; 11–14 are special.',
                quiz: ['Which is correct?', 'пять рублей', 'пять рубля']
            }, { agree: 'quantity', expensive: 'quantity', half: 'quantity', cheaper: 'quantity' }),
            quantity: turn('Хорошо. А огурцы будем брать?', 'All right. Shall we get cucumbers too?', [
                answer('Да, возьмём огурцы.', 'Yes, let’s take cucumbers.', 'yes', 'Simple'),
                answer('Да, два огурца, пожалуйста.', 'Yes, two cucumbers, please.', 'yes', 'Expanded'),
                answer('Нет, огурцы не нужны.', 'No, we don’t need cucumbers.', 'no', 'Natural'),
                answer('Лучше возьмём морковь.', 'Let’s take carrots instead.', 'change', 'Challenge')
            ], [word('огурцы', 'cucumbers'), word('будем брать', 'shall we take / buy'), word('лучше', 'rather / better')], {
                title: 'Counting cucumbers', intro: 'After два, the noun often takes the genitive singular form.',
                forms: [['один огур<span class="ending">ец</span>', 'one cucumber'], ['два огурц<span class="ending">а</span>', 'two cucumbers'], ['пять огурц<span class="ending">ов</span>', 'five cucumbers']],
                note: 'Notice both the ending and the stem change: огурец → огурца.',
                quiz: ['Which means “two cucumbers”?', 'два огурца', 'два огурцы']
            }, { yes: 'closing', no: 'closing', change: 'closing' }),
            closing: turn('Покупки закончены. Спасибо за помощь!', 'Shopping is finished. Thanks for your help!', [],
                [word('покупки', 'purchases / shopping'), word('закончены', 'finished, plural short passive participle'), word('за помощь', 'for the help')], {
                    title: 'Thanks for the help', intro: 'Спасибо за is a useful way to thank someone for something.',
                    forms: [['Спасибо <span class="ending">за</span> помощь!', 'Thanks for the help!'], ['Спасибо <span class="ending">за</span> ужин!', 'Thanks for dinner!']],
                    note: 'За takes the accusative in this meaning. Помощь has the same visible form in nominative and accusative.',
                    quiz: ['Which means “Thanks for dinner”?', 'Спасибо за ужин!', 'Спасибо ужин!']
                }, {})
        }
    },

    timur: {
        character: 'Timur',
        scenario: 'Scenario Four – Cooking Together',
        portrait: 'timur-portrait.png',
        start: 'opening',
        turns: {
            opening: turn('Поможешь мне приготовить ужин?', 'Will you help me prepare dinner?', [
                answer('Конечно, помогу!', 'Of course, I’ll help!', 'yes', 'Simple'),
                answer('Да, что мне делать?', 'Yes, what should I do?', 'yes', 'Expanded'),
                answer('Я ещё учусь готовить.', 'I’m still learning to cook.', 'learning', 'Natural'),
                answer('С чего начнём?', 'What shall we start with?', 'start', 'Challenge')
            ], [word('поможешь', 'will you help (informal)'), word('мне', 'me / to me'), word('приготовить', 'to prepare, finish cooking')], {
                title: 'Helping each other', intro: 'The verb помочь has irregular future forms.',
                forms: [['Я помог<span class="ending">у</span>.', 'I will help.'], ['Ты помож<span class="ending">ешь</span>?', 'Will you help?']],
                note: 'The stem alternates: помог- / помож-. It is not just a change of ending.',
                quiz: ['How do you say “I will help”?', 'Я помогу.', 'Я поможешь.']
            }, { yes: 'vegetables', learning: 'vegetables', start: 'vegetables' }),
            vegetables: turn('Сначала помой овощи, пожалуйста.', 'First wash the vegetables, please.', [
                answer('Хорошо, сейчас помою.', 'Okay, I’ll wash them now.', 'do', 'Simple'),
                answer('Какие овощи нужно помыть?', 'Which vegetables should I wash?', 'which', 'Expanded'),
                answer('Можно я сначала нарежу лук?', 'May I chop the onion first?', 'chop', 'Challenge'),
                answer('Покажи мне, пожалуйста.', 'Show me, please.', 'show', 'Natural')
            ], [word('сначала', 'first'), word('помой', 'wash! (informal)'), word('овощи', 'vegetables'), word('пожалуйста', 'please')], {
                title: 'A friendly instruction', intro: 'Russian uses imperative forms for requests as well as commands.',
                forms: [['Помо<span class="ending">й</span> овощи.', 'Wash the vegetables (informal).'], ['Помо<span class="ending">йте</span> овощи.', 'Wash the vegetables (polite/plural).']],
                note: 'Adding -те makes this imperative polite or plural. Пожалуйста softens the request.',
                quiz: ['Which is polite or plural?', 'Помойте овощи.', 'Помой овощи.']
            }, { do: 'taste', which: 'taste', chop: 'taste', show: 'taste' }),
            taste: turn('Теперь попробуй суп. Достаточно соли?', 'Now taste the soup. Is there enough salt?', [
                answer('Да, очень вкусно!', 'Yes, very tasty!', 'good', 'Simple'),
                answer('Нужно немного соли.', 'It needs a little salt.', 'salt', 'Expanded'),
                answer('По-моему, соли слишком много.', 'I think there’s too much salt.', 'much', 'Challenge'),
                answer('Можно добавить перец?', 'Can we add pepper?', 'pepper', 'Natural')
            ], [word('теперь', 'now'), word('попробуй', 'taste / try (informal)'), word('достаточно', 'enough'), word('соли', 'of salt')], {
                title: 'A little salt', intro: 'After quantity words, Russian commonly uses the genitive.',
                forms: [['сол<span class="ending">ь</span>', 'salt'], ['немного сол<span class="ending">и</span>', 'a little salt']],
                note: 'Соль is feminine and changes to соли in the genitive singular.',
                quiz: ['Which means “a little salt”?', 'немного соли', 'немного соль']
            }, { good: 'closing', salt: 'closing', much: 'closing', pepper: 'closing' }),
            closing: turn('Отличная работа! Приятного аппетита!', 'Great work! Enjoy your meal!', [],
                [word('отличная работа', 'great work'), word('приятного аппетита', 'enjoy your meal / bon appétit')], {
                    title: 'A mealtime wish', intro: 'Приятного аппетита is a fixed, everyday expression.',
                    forms: [['приятн<span class="ending">ый</span> аппетит', 'good appetite (basic form)'], ['приятн<span class="ending">ого</span> аппетит<span class="ending">а</span>!', 'enjoy your meal!']],
                    note: 'Both words are in the genitive. The phrase is an elliptical wish for a pleasant appetite.',
                    quiz: ['Which is the customary mealtime wish?', 'Приятного аппетита!', 'Приятный аппетит!']
                }, {})
        }
    },

    ruslan: {
        character: 'Ruslan',
        scenario: 'Scenario Five – Family Picnic',
        portrait: 'ruslan-portrait.png',
        start: 'opening',
        turns: {
            opening: turn('Как тебе погода сегодня? Пойдём на пикник?', 'How do you like the weather today? Shall we go on a picnic?', [
                answer('Да, отличная идея!', 'Yes, great idea!', 'yes', 'Simple'),
                answer('Сегодня очень тепло.', 'It’s very warm today.', 'warm', 'Expanded'),
                answer('Может быть, пойдём позже?', 'Maybe we could go later?', 'later', 'Natural'),
                answer('А если пойдёт дождь?', 'What if it rains?', 'rain', 'Challenge')
            ], [word('как тебе', 'how do you find / like'), word('погода', 'weather'), word('пойдём', 'shall we go'), word('на пикник', 'on a picnic')], {
                title: 'Going somewhere together', intro: 'Пойдём is often used as a friendly suggestion: “Let’s go.”',
                forms: [['Я пой<span class="ending">ду</span>.', 'I will go.'], ['Мы пой<span class="ending">дём</span>.', 'We will go.']],
                note: 'These are perfective future forms of пойти. The highlighted parts distinguish the persons.',
                quiz: ['Which means “We will go”?', 'Мы пойдём.', 'Я пойду.']
            }, { yes: 'bring', warm: 'bring', later: 'bring', rain: 'rain' }),
            rain: turn('Если будет дождь, останемся дома. Но пока светит солнце!', 'If it rains, we’ll stay home. But the sun is shining for now!', [
                answer('Тогда пойдём сейчас!', 'Then let’s go now!', 'go', 'Simple'),
                answer('Хорошо, возьмём зонтик.', 'Okay, let’s take an umbrella.', 'umbrella', 'Expanded'),
                answer('Давай подождём немного.', 'Let’s wait a little.', 'wait', 'Natural')
            ], [word('если', 'if'), word('будет дождь', 'there will be rain'), word('останемся', 'we will stay'), word('пока', 'for now / while')], {
                title: 'What if it rains?', intro: 'Russian often uses future forms in both parts of a real future condition.',
                forms: [['Если буд<span class="ending">ет</span> дождь…', 'If it rains…'], ['…остан<span class="ending">емся</span> дома.', '…we will stay home.']],
                note: 'Unlike English “if it rains,” Russian uses the future будет.',
                quiz: ['Which means “If it rains”?', 'Если будет дождь', 'Если был дождь']
            }, { go: 'bring', umbrella: 'bring', wait: 'bring' }),
            bring: turn('Что возьмём с собой на пикник?', 'What shall we take with us on the picnic?', [
                answer('Возьмём бутерброды.', 'Let’s take sandwiches.', 'sandwich', 'Simple'),
                answer('Я принесу воду и фрукты.', 'I’ll bring water and fruit.', 'fruit', 'Expanded'),
                answer('Не забудем плед.', 'Let’s not forget a blanket.', 'blanket', 'Natural'),
                answer('А кто принесёт напитки?', 'And who will bring the drinks?', 'drinks', 'Challenge')
            ], [word('возьмём', 'we will take'), word('с собой', 'with us'), word('принесу', 'I will bring'), word('не забудем', 'let’s not forget')], {
                title: 'Bring it along', intro: 'Принести is a perfective verb meaning to bring something to a place.',
                forms: [['Я принес<span class="ending">у</span> воду.', 'I will bring water.'], ['Ты принес<span class="ending">ёшь</span> фрукты?', 'Will you bring fruit?']],
                note: 'Russian future verb endings change with the subject.',
                quiz: ['Which means “I will bring water”?', 'Я принесу воду.', 'Ты принесёшь воду.']
            }, { sandwich: 'closing', fruit: 'closing', blanket: 'closing', drinks: 'closing' }),
            closing: turn('Договорились! Встретимся в парке. До скорого!', 'Agreed! We’ll meet at the park. See you soon!', [],
                [word('договорились', 'agreed / it’s settled'), word('встретимся', 'we will meet'), word('в парке', 'in the park'), word('до скорого', 'see you soon')], {
                    title: 'Why скорого?', intro: 'До скорого is a shortened farewell: until we meet again soon.',
                    forms: [['скор<span class="ending">ый</span>', 'soon / forthcoming (adjective)'], ['до скор<span class="ending">ого</span>', 'see you soon (genitive adjective)']],
                    note: 'До takes the genitive. Скорого agrees with an understood noun, traditionally свидания. Скоро is a different word: an adverb.',
                    quiz: ['Which is the natural farewell?', 'До скорого!', 'До скоро!']
                }, {})
        }
    },

    elena: {
        character: 'Elena',
        scenario: 'Scenario Six – Visiting Relatives',
        portrait: 'elena-portrait.png',
        start: 'opening',
        turns: {
            opening: turn('Как я рада тебя видеть! Проходи, пожалуйста!', 'I’m so happy to see you! Come in, please!', [
                answer('Здравствуйте!', 'Hello! (polite)', 'hello', 'Simple'),
                answer('Спасибо, очень рад вас видеть.', 'Thank you, I’m very glad to see you. (male speaker)', 'greet', 'Expanded'),
                answer('Спасибо, очень рада вас видеть.', 'Thank you, I’m very glad to see you. (female speaker)', 'greet', 'Expanded'),
                answer('Как у вас дела?', 'How are you doing?', 'ask', 'Natural')
            ], [word('как я рада', 'how happy I am (female speaker)'), word('тебя видеть', 'to see you (informal)'), word('проходи', 'come in (informal)'), word('пожалуйста', 'please')], {
                title: 'Come in!', intro: 'Russian invitations change depending on whether you address one familiar person or speak politely.',
                forms: [['Проход<span class="ending">и</span>!', 'Come in! (informal)'], ['Проход<span class="ending">ите</span>!', 'Come in! (polite/plural)']],
                note: 'Проходи and проходите are imperative forms of проходить.',
                quiz: ['Which is polite or plural?', 'Проходите!', 'Проходи!']
            }, { hello: 'tea', greet: 'tea', ask: 'tea' }),
            tea: turn('Хочешь чаю? У меня есть пирог.', 'Would you like some tea? I have pie.', [
                answer('Да, пожалуйста.', 'Yes, please.', 'yes', 'Simple'),
                answer('С удовольствием выпью чаю.', 'I’d gladly have some tea.', 'yes', 'Natural'),
                answer('Спасибо, я лучше выпью воды.', 'Thanks, I’d rather have water.', 'water', 'Expanded'),
                answer('А какой у вас пирог?', 'What kind of pie do you have?', 'pie', 'Challenge')
            ], [word('хочешь', 'would you like (informal)'), word('чаю', 'some tea (partitive genitive)'), word('у меня есть', 'I have'), word('пирог', 'pie')], {
                title: 'Some tea, please', intro: 'In everyday Russian, чаю is a common partitive genitive form meaning some tea.',
                forms: [['ча<span class="ending">й</span>', 'tea'], ['ч<span class="ending">аю</span>', 'some tea']],
                note: 'Чаю is a special -у partitive form, often heard in invitations. Чая is also possible in many contexts.',
                quiz: ['Which invitation is natural?', 'Хочешь чаю?', 'Хочешь чаи?']
            }, { yes: 'treat', water: 'treat', pie: 'treat' }),
            treat: turn('Вот пирог. Угощайся! Как тебе?', 'Here’s the pie. Help yourself! What do you think?', [
                answer('Очень вкусно!', 'Very delicious!', 'good', 'Simple'),
                answer('Спасибо, мне очень нравится.', 'Thank you, I really like it.', 'like', 'Expanded'),
                answer('Можно ещё кусочек?', 'May I have another piece?', 'more', 'Natural'),
                answer('А как вы его готовите?', 'And how do you make it?', 'recipe', 'Challenge')
            ], [word('вот', 'here is'), word('угощайся', 'help yourself (informal)'), word('как тебе', 'what do you think / how do you like it'), word('кусочек', 'a small piece')], {
                title: 'A warm invitation', intro: 'Угощайся is a friendly invitation, not a harsh command.',
                forms: [['Угоща<span class="ending">йся</span>!', 'Help yourself! (informal)'], ['Угоща<span class="ending">йтесь</span>!', 'Help yourselves! (polite/plural)']],
                note: 'From угощаться (imperfective reflexive verb). The related perfective infinitive is угоститься.',
                quiz: ['Which is addressed to several guests?', 'Угощайтесь!', 'Угощайся!']
            }, { good: 'closing', like: 'closing', more: 'closing', recipe: 'closing' }),
            closing: turn('Приходи ещё! Всегда тебе рада. До свидания!', 'Come again! I’m always happy to see you. Goodbye!', [],
                [word('приходи', 'come / visit again (informal)'), word('ещё', 'again / more'), word('всегда', 'always'), word('до свидания', 'goodbye')], {
                    title: 'Until we meet again', intro: 'До свидания is a standard, polite farewell.',
                    forms: [['свидани<span class="ending">е</span>', 'a meeting / date'], ['до свидани<span class="ending">я</span>', 'goodbye']],
                    note: 'The preposition до requires the genitive; свидание changes to свидания.',
                    quiz: ['Which is correct?', 'До свидания!', 'До свидание!']
                }, {})
        }
    },

    sofia: {
        character: 'Sofia',
        scenario: 'Scenario Seven – Vacation Restaurant',
        portrait: 'sofia-portrait.png',
        start: 'opening',
        turns: {
            opening: turn('Мы в ресторане! Что ты будешь заказывать?', 'We’re at the restaurant! What will you order?', [
                answer('Я возьму суп.', 'I’ll have soup.', 'soup', 'Simple'),
                answer('Я закажу рыбу.', 'I’ll order fish.', 'fish', 'Expanded'),
                answer('Я хочу попробовать местное блюдо.', 'I want to try a local dish.', 'local', 'Natural'),
                answer('Что ты мне посоветуешь?', 'What would you recommend to me?', 'recommend', 'Challenge')
            ], [word('в ресторане', 'at / in a restaurant'), word('будешь', 'you will'), word('заказывать', 'to order'), word('блюдо', 'dish')], {
                title: 'Ordering in Russian', intro: 'Заказывать is imperfective; заказать is its common perfective partner.',
                forms: [['Я заказыва<span class="ending">ю</span>.', 'I am ordering.'], ['Я закаж<span class="ending">у</span>.', 'I will order.']],
                note: 'These are different aspect forms and stems, not just interchangeable endings.',
                quiz: ['Which means “I will order”?', 'Я закажу.', 'Я заказываю.']
            }, { soup: 'drink', fish: 'drink', local: 'recommend', recommend: 'recommend' }),
            recommend: turn('Советую попробовать пельмени. Они здесь очень вкусные!', 'I recommend trying pelmeni. They’re delicious here!', [
                answer('Хорошо, закажу пельмени.', 'Okay, I’ll order pelmeni.', 'yes', 'Simple'),
                answer('Отлично! Давай возьмём пельмени.', 'Great! Let’s get pelmeni.', 'yes', 'Expanded'),
                answer('Спасибо, но я предпочитаю рыбу.', 'Thanks, but I prefer fish.', 'fish', 'Natural'),
                answer('А с чем подают пельмени?', 'What do they serve with pelmeni?', 'with', 'Challenge')
            ], [word('советую', 'I recommend'), word('попробовать', 'to try / taste'), word('они', 'they'), word('здесь', 'here')], {
                title: 'Delicious dumplings', intro: 'Adjectives agree with plural nouns.',
                forms: [['вкусн<span class="ending">ый</span> суп', 'delicious soup'], ['вкусн<span class="ending">ые</span> пельмени', 'delicious pelmeni']],
                note: 'Вкусные is the plural adjective form; пельмени is plural.',
                quiz: ['Which means “delicious pelmeni”?', 'вкусные пельмени', 'вкусный пельмени']
            }, { yes: 'drink', fish: 'drink', with: 'drink' }),
            drink: turn('А что будем пить?', 'And what shall we drink?', [
                answer('Воду, пожалуйста.', 'Water, please.', 'water', 'Simple'),
                answer('Я хочу чай с лимоном.', 'I’d like tea with lemon.', 'tea', 'Expanded'),
                answer('Мне, пожалуйста, сок без сахара.', 'Juice without sugar for me, please.', 'juice', 'Natural'),
                answer('Можно стакан минеральной воды?', 'May I have a glass of mineral water?', 'mineral', 'Challenge')
            ], [word('пить', 'to drink'), word('с лимоном', 'with lemon'), word('без сахара', 'without sugar'), word('стакан', 'glass')], {
                title: 'With or without?', intro: 'С (“with”) takes the instrumental case here; без (“without”) takes the genitive.',
                forms: [['лимон', 'lemon'], ['с лимон<span class="ending">ом</span>', 'with lemon'], ['без лимон<span class="ending">а</span>', 'without lemon']],
                note: 'One noun, two prepositions, two different endings.',
                quiz: ['Which means “without lemon”?', 'без лимона', 'с лимоном']
            }, { water: 'closing', tea: 'closing', juice: 'closing', mineral: 'closing' }),
            closing: turn('Прекрасно! Приятного аппетита! Спасибо за компанию!', 'Wonderful! Enjoy your meal! Thanks for the company!', [],
                [word('прекрасно', 'wonderful'), word('приятного аппетита', 'enjoy your meal'), word('за компанию', 'for the company / companionship')], {
                    title: 'Enjoy your meal', intro: 'This fixed wish uses genitive forms.',
                    forms: [['приятн<span class="ending">ый</span> аппетит', 'a good appetite'], ['приятн<span class="ending">ого</span> аппетит<span class="ending">а</span>!', 'enjoy your meal!']],
                    note: 'The adjective and noun both change. Learn the whole expression as a friendly mealtime wish.',
                    quiz: ['Which is the natural wish?', 'Приятного аппетита!', 'Приятный аппетит!']
                }, {})
        }
    }
};
