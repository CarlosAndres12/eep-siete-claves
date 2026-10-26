/* Videos (spec §11): escenas, «Se ve», textos en pantalla, cifras, líneas de voz, preguntas y capítulos.
   Copia final de la spec; el facilitador puede editar aquí cualquier texto sin tocar el código de dibujo.
   `texts` reúne, en orden, los textos «…» del brief de dibujo de cada escena (t1, t2…). */
window.EEP.data.videos = [
  {
    "id": "v1",
    "slug": "coberturas",
    "title": "Cómo se mapea la vegetación de Medellín con satélites e inteligencia artificial",
    "unit": "Punto 1",
    "target": [
      300,
      420
    ],
    "poster": {
      "scene": "mapa-2024",
      "p": 0.6
    },
    "chapters": [
      {
        "title": "Qué cubre el suelo",
        "from": "gancho"
      },
      {
        "title": "Cómo aprende el programa",
        "from": "insumos"
      },
      {
        "title": "El mapa de 2024 y sus límites",
        "from": "mapa-2024"
      },
      {
        "title": "Lo que permite el mapa",
        "from": "usos"
      },
      {
        "title": "Vigilar los cambios",
        "from": "alertas"
      }
    ],
    "scenes": [
      {
        "id": "gancho",
        "type": "title",
        "min": 8,
        "seVe": "El título pregunta qué cubre el suelo de Medellín, sobre un corte del valle con bosques, cultivos y ciudad.",
        "figs": [],
        "texts": {
          "t1": "¿QUÉ CUBRE EL SUELO DE MEDELLÍN?"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "¿Qué cubre el suelo de Medellín en cada lugar: bosque, pastos, cultivos, agua o ciudad?"
          },
          {
            "voice": "narrador",
            "text": "Según el estudio técnico de la Universidad de Antioquia para el Distrito y el Área Metropolitana, un mapa actualizado de esas coberturas alimenta el diagnóstico de la estructura ecológica y el análisis de riesgo."
          }
        ]
      },
      {
        "id": "cobertura",
        "type": "explain",
        "min": 9,
        "seVe": "Un corte del valle muestra bosques, pastos, cultivos, agua y ciudad, y Lucía pregunta por los mapas que ya existen.",
        "figs": [],
        "texts": {
          "t1": "Bosque",
          "t2": "Pastos",
          "t3": "Cultivos",
          "t4": "Agua",
          "t5": "Ciudad",
          "t6": "coberturas de la tierra"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "A eso se le llama cobertura de la tierra: lo que cubre la superficie en cada lugar."
          },
          {
            "voice": "lucia",
            "text": "¿Y eso no está ya en los mapas oficiales?"
          },
          {
            "voice": "narrador",
            "text": "Sí existen, y el estudio partió de ellos: su programa aprendió de un mapa oficial. Según el estudio, los satélites con aprendizaje automático son una alternativa de alta frecuencia para seguir los cambios con poco rezago."
          },
          {
            "voice": "narrador",
            "text": "¿Y cómo aprende un programa a reconocer un bosque?"
          }
        ],
        "ficcion": true
      },
      {
        "id": "insumos",
        "type": "explain",
        "min": 10,
        "seVe": "Tres tarjetas de datos —el mapa oficial de 2021 de la zona rural, ortofotos e imágenes de satélite— entran bajo la lámpara del clasificador.",
        "figs": [],
        "texts": {
          "t1": "Mapa oficial de coberturas 2021 · zona rural",
          "t2": "Ortofotos",
          "t3": "Imágenes de satélite anuales",
          "t4": "clasificación supervisada"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El programa aprendió de ejemplos: un mapa oficial de coberturas de 2021, que cubre la zona rural; ortofotos, que son fotografías aéreas corregidas para que coincidan con un mapa, e imágenes de satélite anuales."
          },
          {
            "voice": "narrador",
            "text": "Es una clasificación supervisada: el programa estudia un mapa ya clasificado y aprende a reconocer cada cobertura en imágenes nuevas."
          }
        ]
      },
      {
        "id": "muestras",
        "type": "explain",
        "min": 11,
        "seVe": "Un parche de cobertura se encoge hacia adentro y solo su interior recibe una malla de puntos; una tarjeta indica 100 muestras base por clase.",
        "figs": [
          "P1-C02"
        ],
        "texts": {
          "t1": "Demasiado cerca"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Para aprender bien, usa al menos 100 muestras por cada tipo de cobertura, separadas entre sí y tomadas lejos de los bordes."
          },
          {
            "voice": "lucia",
            "text": "¿Por qué lejos de los bordes?"
          },
          {
            "voice": "narrador",
            "text": "Porque en los bordes se mezclan coberturas, y las muestras demasiado cercanas repiten la misma información: el modelo memorizaría en lugar de aprender."
          }
        ]
      },
      {
        "id": "arboles",
        "type": "explain",
        "min": 10,
        "seVe": "En el panel del mapa, una fila de árboles de decisión, en la que cada uno corrige los errores del anterior, y un dial que ajusta la configuración del clasificador.",
        "figs": [],
        "texts": {
          "t1": "Cada árbol corrige los errores del anterior",
          "t2": "Ajustes automáticos"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El clasificador reúne muchos árboles de decisión pequeños: cada árbol nuevo se dedica a corregir los errores del anterior."
          },
          {
            "voice": "narrador",
            "text": "Y un programa de optimización prueba los ajustes internos del clasificador de forma automática, hasta encontrar los que mejor funcionan."
          }
        ]
      },
      {
        "id": "transferencia",
        "type": "explain",
        "min": 12,
        "seVe": "El clasificador entrenado con 2021 se aplica a imágenes de 2024 y entrega cuatro grupos de coberturas; el documento no describe cómo clasificó las clases urbanas.",
        "figs": [],
        "texts": {
          "t1": "2021",
          "t2": "2024",
          "t3": "Imágenes de 2024",
          "t4": "Territorios artificializados",
          "t5": "Territorios agrícolas",
          "t6": "Bosques y áreas seminaturales",
          "t7": "Zonas húmedas y cuerpos de agua",
          "t8": "Clases urbanas: método no descrito",
          "t9": "Ejemplos",
          "t10": "Árboles que corrigen errores",
          "t11": "Ajuste automático"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Entrenado con 2021, el modelo se aplicó a imágenes de 2024 y produjo un mapa de coberturas de todo el Distrito."
          },
          {
            "voice": "lucia",
            "text": "Pero el mapa de 2021 era solo de la zona rural. ¿Cómo clasificó la ciudad?"
          },
          {
            "voice": "narrador",
            "text": "El documento no describe cómo se clasificaron ni se validaron las clases urbanas del mapa de 2024."
          },
          {
            "voice": "narrador",
            "text": "En resumen: ejemplos bien elegidos, árboles que corrigen los errores del anterior y un ajuste automático."
          }
        ]
      },
      {
        "id": "mapa-2024",
        "type": "explain",
        "min": 10,
        "seVe": "Un esquema del valle, sin límites reales, muestra cómo el mapa de 2024 agrupa las coberturas del Distrito.",
        "figs": [],
        "texts": {
          "t1": "Territorios artificializados",
          "t2": "Territorios agrícolas",
          "t3": "Bosques y áreas seminaturales",
          "t4": "Zonas húmedas y cuerpos de agua",
          "t5": "Esquema",
          "t6": "INSUMO PARA EL DIAGNÓSTICO"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El resultado central es un mapa de coberturas del Distrito para 2024: territorios artificializados, agrícolas, bosques y áreas seminaturales, y zonas húmedas y cuerpos de agua."
          },
          {
            "voice": "narrador",
            "text": "El estudio lo presenta como insumo para el diagnóstico de la estructura ecológica y de las áreas de amenaza y riesgo."
          }
        ]
      },
      {
        "id": "meta-85",
        "type": "figure",
        "min": 12,
        "seVe": "Una tarjeta muestra la meta de exactitud del 85 % y advierte que el documento no reporta su cumplimiento.",
        "figs": [
          "P1-C01"
        ],
        "texts": {
          "t1": "Con matiz",
          "t2": "Meta, no medición"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El estudio se fijó como meta una exactitud mínima del 85 %, que debía comprobarse con una matriz de confusión: una tabla que compara el mapa con lo verificado en la realidad."
          },
          {
            "voice": "narrador",
            "text": "Pero el documento todavía no reporta esa verificación: ni la exactitud ni la matriz de confusión del mapa de 2024."
          },
          {
            "voice": "lucia",
            "text": "Entonces el mapa acierta el 85 % de las veces.",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No. El 85 % es la meta que el estudio se fijó, no una exactitud medida."
          }
        ]
      },
      {
        "id": "criterio",
        "type": "explain",
        "min": 10,
        "seVe": "Tres apoyos —verificación en terreno, cartografía oficial e imágenes aéreas recientes— acompañan al mapa, junto al sello sobre la inteligencia artificial.",
        "figs": [],
        "texts": {
          "t1": "Verificación en terreno",
          "t2": "Cartografía oficial",
          "t3": "Imágenes aéreas recientes"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El estudio advierte que estos mapas no deben presentarse como un resultado cerrado: pide contrastarlos con imágenes aéreas recientes, verificaciones en terreno y la cartografía oficial antes de decidir."
          },
          {
            "voice": "narrador",
            "text": "En breve: un mapa hecho con inteligencia artificial apoya, pero no reemplaza, el criterio técnico."
          }
        ]
      },
      {
        "id": "usos",
        "type": "explain",
        "min": 10,
        "seVe": "Un esquema compara el uso actual del suelo rural con lo que permite la norma y marca con rayas la diferencia.",
        "figs": [],
        "texts": {
          "t1": "Uso actual",
          "t2": "Lo que permite la norma",
          "t3": "conflicto de uso",
          "t4": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Con el mapa, el estudio dedujo los usos actuales del suelo rural y los comparó con lo que la norma permite."
          },
          {
            "voice": "narrador",
            "text": "Donde no coinciden, hay un conflicto de uso."
          }
        ]
      },
      {
        "id": "conflicto",
        "type": "figure",
        "min": 12,
        "seVe": "Una tarjeta muestra 10.534,68 hectáreas rurales en conflicto de uso, en una primera estimación, con la nota de que no significa ilegalidad.",
        "figs": [
          "P1-C09"
        ],
        "texts": {
          "t1": "Resultado del estudio",
          "t2": "Con matiz",
          "t3": "No significa ilegalidad ni daño ambiental"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "En una primera estimación, el estudio identificó 10.534,68 hectáreas rurales en conflicto con la norma; el documento las refiere a años distintos según el pasaje."
          },
          {
            "voice": "hernan",
            "text": "¿Conflicto quiere decir que la gente está haciendo algo ilegal?",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No. Es una diferencia entre el uso actual y lo que la norma permite; no significa ilegalidad ni implica necesariamente daño ambiental."
          }
        ]
      },
      {
        "id": "recuperacion",
        "type": "compare",
        "min": 11,
        "seVe": "Dos columnas: según el estudio, en la estructura ecológica rural se recuperan bosques y en los corredores que conectan áreas naturales crece la presión, sin cifras.",
        "figs": [],
        "texts": {
          "t1": "Estructura ecológica rural",
          "t2": "Corredores que conectan",
          "t3": "Sin cifras: capas de fuentes distintas"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Comparando mapas de distintos años, el estudio observa recuperación de bosques en la estructura ecológica rural y más presión sobre los corredores que conectan áreas naturales."
          },
          {
            "voice": "narrador",
            "text": "Para esos corredores no se dan cifras: el documento compara capas de fuentes distintas y reporta versiones que no coinciden."
          }
        ]
      },
      {
        "id": "bosques",
        "type": "figure",
        "min": 11,
        "seVe": "Dos tarjetas muestran el criterio de 50 hectáreas para un hábitat funcional y seis bosques densos de ese tamaño o muy cercanos, en Santa Elena, San Sebastián de Palmitas y San Antonio de Prado.",
        "figs": [
          "P1-C24",
          "P1-C42"
        ],
        "texts": {
          "t1": "Santa Elena",
          "t2": "San Sebastián de Palmitas",
          "t3": "San Antonio de Prado"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Un criterio de Di Bitetti y colaboradores dice que un hábitat funcional requiere un bosque continuo de al menos 50 hectáreas."
          },
          {
            "voice": "narrador",
            "text": "Con el mapa rural de 2021, una lectura preliminar identificó seis bosques densos de ese tamaño o muy cercanos, capaces de servir como hábitat."
          },
          {
            "voice": "narrador",
            "text": "Están en Santa Elena, San Sebastián de Palmitas y San Antonio de Prado."
          },
          {
            "voice": "narrador",
            "text": "¿Y qué permitiría repetir este mapeo cada cierto tiempo?"
          }
        ]
      },
      {
        "id": "alertas",
        "type": "explain",
        "min": 11,
        "seVe": "Un satélite pasa dos veces sobre el esquema del valle y marca con una alerta temprana el lugar que cambió, junto al sello de insumo técnico.",
        "figs": [],
        "texts": {
          "t1": "Alerta temprana",
          "t2": "Alertas de urbanización"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Repetir este mapeo permitiría vigilar los cambios con alertas tempranas: avisos que se activan cuando las imágenes muestran cambios importantes."
          },
          {
            "voice": "narrador",
            "text": "El estudio recomienda, además, un sistema de alertas de urbanización desde el primer periodo del plan de ordenamiento que se revisa."
          },
          {
            "voice": "narrador",
            "text": "Son recomendaciones del estudio, no decisiones adoptadas."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 10,
        "seVe": "Lucía y Hernán miran el valle y aparece la frase final: la inteligencia artificial apoya, no reemplaza, el criterio técnico.",
        "figs": [],
        "texts": {
          "t1": "LA INTELIGENCIA ARTIFICIAL APOYA, NO REEMPLAZA, EL CRITERIO TÉCNICO"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Un mapa actualizado ayuda a entender cómo cambia el territorio y a cuidarlo; es un insumo técnico, y el documento no reporta su exactitud."
          },
          {
            "voice": "narrador",
            "text": "Como dice el estudio: la inteligencia artificial apoya la lectura del territorio, pero no reemplaza el criterio técnico."
          }
        ]
      }
    ],
    "checkpoints": [
      {
        "after": "meta-85",
        "question": "El 85 % del que habla el estudio es…",
        "options": [
          "La exactitud medida del mapa de 2024",
          "La meta de exactitud que el estudio se fijó",
          "El agua que llega al valle desde fuera"
        ],
        "answer": 1,
        "explain": "Es una meta de validación con matriz de confusión; el documento todavía no reporta su cumplimiento.",
        "hint": "La clave está en lo que falta en el documento."
      }
    ],
    "pauses": []
  },
  {
    "id": "v2",
    "slug": "ocho-mensajes",
    "title": "Los ocho mensajes principales del estudio",
    "unit": "Punto 2",
    "target": [
      480,
      600
    ],
    "poster": {
      "scene": "m5",
      "p": 0.6
    },
    "chapters": [
      {
        "title": "1 · Estructura predial rural",
        "from": "apertura"
      },
      {
        "title": "2 · Amenaza, exposición y vulnerabilidad",
        "from": "m2"
      },
      {
        "title": "3 · Soberanía alimentaria",
        "from": "m3"
      },
      {
        "title": "4 · Retiros hídricos",
        "from": "m4"
      },
      {
        "title": "5 · Conectividad ecológica",
        "from": "m5"
      },
      {
        "title": "6 · Ocupación del suelo",
        "from": "m6"
      },
      {
        "title": "7 · Interdependencia regional",
        "from": "m7"
      },
      {
        "title": "8 · Un mismo sistema",
        "from": "m8"
      }
    ],
    "scenes": [
      {
        "id": "apertura",
        "type": "title",
        "min": 10,
        "seVe": "El título presenta los ocho mensajes principales del estudio como ocho tarjetas en fila.",
        "figs": [],
        "texts": {
          "t1": "LOS OCHO MENSAJES",
          "t2": "del estudio técnico",
          "t3": "Estructura predial rural",
          "t4": "Amenaza, exposición y vulnerabilidad",
          "t5": "Soberanía alimentaria",
          "t6": "Retiros hídricos",
          "t7": "Conectividad ecológica",
          "t8": "Ocupación del suelo",
          "t9": "Interdependencia regional",
          "t10": "Un mismo sistema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El estudio técnico resume sus hallazgos en ocho mensajes principales, presentados a página completa a lo largo del documento."
          },
          {
            "voice": "narrador",
            "text": "Son síntesis para los equipos de decisión, no normas ni decisiones adoptadas; aquí se presentan con sus matices."
          }
        ]
      },
      {
        "id": "m1",
        "type": "figure",
        "min": 12,
        "seVe": "Una tarjeta muestra que el 94,7 % de los 18.493 predios rurales tiene menos de 4 hectáreas, y otra, el rango oficial de la Unidad Agrícola Familiar.",
        "figs": [
          "P2-C03",
          "P2-C04"
        ],
        "texts": {
          "t1": "MENSAJE PRINCIPAL · ESTRUCTURA PREDIAL RURAL",
          "t2": "Unidad Agrícola Familiar",
          "t3": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Primer mensaje: el 94,7 % de los 18.493 predios rurales de Medellín tiene menos de 4 hectáreas."
          },
          {
            "voice": "narrador",
            "text": "Cuatro hectáreas es un umbral operativo del estudio; la Unidad Agrícola Familiar oficial, según un estudio de la Alcaldía de 2012, es mayor, así que con ella la proporción sería todavía más alta."
          },
          {
            "voice": "narrador",
            "text": "La Unidad Agrícola Familiar es el tamaño mínimo de finca con el que una familia puede vivir de producir."
          }
        ]
      },
      {
        "id": "m1-decision",
        "type": "dialogue",
        "min": 12,
        "seVe": "Hernán, junto a su huerta, mira una ladera dividida en predios pequeños mientras se acerca la línea del borde urbano.",
        "figs": [],
        "texts": {
          "t1": "PROTEGER LA ESTRUCTURA PREDIAL CAMPESINA O ACEPTAR SU DISOLUCIÓN FUNCIONAL",
          "t2": "Borde urbano"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El estudio pide una decisión explícita: proteger la estructura predial campesina o aceptar su disolución funcional."
          },
          {
            "voice": "hernan",
            "text": "¿Y qué tiene que ver el borde de la ciudad con eso?"
          },
          {
            "voice": "narrador",
            "text": "El estudio asocia la división de los predios a los bordes urbanos; por eso el mensaje advierte que, sin esa decisión, el borde seguirá definiendo el uso del suelo rural: es una lectura, no una proyección medida."
          },
          {
            "voice": "narrador",
            "text": "Primer mensaje, en breve: un campo muy dividido, y el estudio pide una decisión explícita sobre él."
          }
        ],
        "ficcion": true
      },
      {
        "id": "m2",
        "type": "figure",
        "min": 12,
        "seVe": "Una tarjeta muestra que el 40,93 % del área urbanizada está en amenaza alta por movimientos en masa según el mapa combinado: cuatro de cada diez hectáreas.",
        "figs": [
          "P2-C09",
          "P2-C10",
          "P2-C08"
        ],
        "texts": {
          "t1": "MENSAJE PRINCIPAL · AMENAZA, EXPOSICIÓN Y VULNERABILIDAD",
          "t2": "Ladera",
          "t3": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Segundo mensaje: según el mapa que combina dos estudios de amenaza, el 40,93 % del área urbanizada está en amenaza alta por movimientos en masa, como los deslizamientos."
          },
          {
            "voice": "narrador",
            "text": "Es decir, cuatro de cada diez hectáreas urbanizadas, sobre todo en las laderas."
          }
        ]
      },
      {
        "id": "m2-exposicion",
        "type": "explain",
        "min": 11,
        "seVe": "Sobre el corte del valle, la amenaza de la ladera queda igual y lo que cambia es dónde y con qué densidad se construye.",
        "figs": [],
        "texts": {
          "t1": "El ordenamiento no modifica la amenaza",
          "t2": "Dónde se construye",
          "t3": "Con qué densidad",
          "t4": "Cambio climático"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, el ordenamiento no modifica la amenaza del terreno: actúa sobre la exposición y la vulnerabilidad; la exposición depende de dónde y con qué densidad se construye."
          },
          {
            "voice": "narrador",
            "text": "Aun así, el estudio prevé que el cambio climático haga crecer las amenazas."
          }
        ]
      },
      {
        "id": "m2-bases",
        "type": "compare",
        "min": 13,
        "seVe": "Dos columnas separan el 40,93 % del área urbanizada, del mapa combinado, y el 37,23 % del Distrito, de la zonificación oficial, con el sello de que no se suman ni se comparan.",
        "figs": [
          "P2-C09",
          "P2-C13"
        ],
        "texts": {
          "t1": "Área urbanizada · mapa combinado",
          "t2": "Todo el Distrito · zonificación oficial"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "La zonificación oficial de los Estudios Básicos de Amenaza usa otra base: allí, la amenaza alta por movimientos en masa cubre el 37,23 % del Distrito."
          },
          {
            "voice": "lucia",
            "text": "¿Y cuál de las dos cifras es la correcta?"
          },
          {
            "voice": "narrador",
            "text": "No se trata de elegir: una sale del mapa combinado y mide el área urbanizada; la otra sale de la zonificación oficial y mide todo el Distrito. No se suman ni se comparan."
          }
        ]
      },
      {
        "id": "m3",
        "type": "explain",
        "min": 13,
        "seVe": "Una canasta pequeña de producción local frente a muchos cajones que llegan al valle, en un esquema sin valores, junto a una tarjeta sin cifra.",
        "figs": [],
        "texts": {
          "t1": "MENSAJE PRINCIPAL · SOBERANÍA ALIMENTARIA",
          "t2": "Producción de Medellín",
          "t3": "Alimentos que demanda el valle",
          "t4": "Esquema",
          "t5": "Porcentaje del titular",
          "t6": "Sin cifra: medidas que no son equivalentes",
          "t7": "La conclusión robusta no depende del porcentaje exacto"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Tercer mensaje: Medellín produce una fracción mínima de los alimentos que demanda el Valle de Aburrá."
          },
          {
            "voice": "narrador",
            "text": "El titular del estudio da un porcentaje, pero el documento no muestra su cálculo y mide la dependencia alimentaria de varias formas que no son equivalentes."
          },
          {
            "voice": "narrador",
            "text": "Lo que el estudio considera firme es que esa producción es una fracción mínima de la demanda: «la conclusión robusta no depende del porcentaje exacto»."
          }
        ]
      },
      {
        "id": "m3-region",
        "type": "dialogue",
        "min": 12,
        "seVe": "En un mercado campesino, Hernán pregunta por la producción local mientras llegan alimentos de las subregiones.",
        "figs": [],
        "texts": {
          "t1": "Subregiones y otros departamentos",
          "t2": "PROPUESTA DEL ESTUDIO: ACUERDOS DE ABASTECIMIENTO"
        },
        "lines": [
          {
            "voice": "hernan",
            "text": "Entonces, ¿Medellín no produce alimentos?",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "Sí produce, pero poco frente a lo que demanda el valle; el estudio advierte que no se debe prometer autosuficiencia."
          },
          {
            "voice": "narrador",
            "text": "La soberanía alimentaria, que es la capacidad de un territorio de decidir cómo produce, distribuye y consume sus alimentos, se construye con las subregiones; por eso el estudio propone acuerdos de abastecimiento con las subregiones productoras."
          },
          {
            "voice": "narrador",
            "text": "Tercer mensaje, en breve: el alimento de Medellín se produce, sobre todo, fuera de Medellín."
          }
        ]
      },
      {
        "id": "m4",
        "type": "figure",
        "min": 13,
        "seVe": "Un esquema de una quebrada muestra retiros de 10 o 15 m en determinadas zonas urbanas y el mínimo de 30 m de la sentencia.",
        "figs": [
          "P2-C30",
          "P2-C31"
        ],
        "texts": {
          "t1": "MENSAJE PRINCIPAL · RETIROS HÍDRICOS",
          "t2": "Cauce y referencias ilustrativos",
          "t3": "Acuerdo 48 de 2014 · determinadas zonas urbanas",
          "t4": "Sentencia T-529 de 2025 · mínimo",
          "t5": "Con matiz",
          "t6": "El capítulo prospectivo cita otra norma"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Cuarto mensaje: los retiros, franjas que se dejan libres a cada lado de un cauce para proteger el agua y prevenir daños por crecientes."
          },
          {
            "voice": "narrador",
            "text": "Sobre los cauces conviven reglas distintas: según el Acuerdo 48 de 2014, 10 o 15 metros en determinadas zonas urbanas; según la Sentencia T-529 de 2025, un mínimo de 30 metros."
          },
          {
            "voice": "narrador",
            "text": "En su capítulo de prospectiva, el documento atribuye esos 30 metros a otra norma, el Decreto 1076 de 2015."
          }
        ],
        "scale": {
          "from": 0,
          "to": 30,
          "step": 5,
          "unit": "m"
        }
      },
      {
        "id": "m4-ciudad",
        "type": "figure",
        "min": 13,
        "seVe": "Una tarjeta muestra 1.358,25 hectáreas que la propuesta incorpora a ríos y quebradas, con la nota de que el documento no cuantifica la parte urbana.",
        "figs": [
          "P2-C28",
          "P2-C31"
        ],
        "texts": {
          "t1": "Propuesta del estudio",
          "t2": "Con matiz",
          "t3": "El documento no cuantifica la parte urbana",
          "t4": "Régimen de transición por tipo de tramo"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "La propuesta del estudio aplica ese mínimo e incorpora 1.358,25 hectáreas al elemento de ríos y quebradas con sus retiros, incluidos sectores ya urbanizados."
          },
          {
            "voice": "narrador",
            "text": "Es una propuesta, no una norma adoptada, y el documento no cuantifica qué parte de esa área es urbana."
          },
          {
            "voice": "narrador",
            "text": "El estudio recomienda adoptar el retiro mínimo de 30 metros con un régimen de transición por tipo de tramo."
          },
          {
            "voice": "narrador",
            "text": "Cuarto mensaje, en breve: la estructura ecológica también se decide en la ciudad construida."
          }
        ]
      },
      {
        "id": "m5",
        "type": "compare",
        "min": 12,
        "seVe": "A la izquierda, un corredor dibujado en el mapa; a la derecha, el mismo corredor en el territorio, con vacíos entre los árboles.",
        "figs": [],
        "texts": {
          "t1": "En el mapa",
          "t2": "dibujado",
          "t3": "En el territorio",
          "t4": "en el territorio"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Quinto mensaje: un corredor dibujado no garantiza un corredor que funcione."
          },
          {
            "voice": "narrador",
            "text": "El estudio reporta que en los enlaces estructurantes, los corredores que unen las áreas naturales, disminuyó la proporción de bosques y áreas seminaturales."
          }
        ]
      },
      {
        "id": "m5-cifra",
        "type": "figure",
        "min": 14,
        "seVe": "Una tarjeta sin valores indica que la serie de los enlaces no se cita; otra muestra 13.785,68 hectáreas con capacidad media o alta para sostener flujos ecológicos.",
        "figs": [
          "P2-C41"
        ],
        "texts": {
          "t1": "Serie de los enlaces estructurantes",
          "t2": "Sin cifra: el texto y una figura no coinciden en los años"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El titular trae dos porcentajes que aquí no se usan: el texto y una figura del documento asignan esos valores a años distintos, y la serie compara capas de fuentes distintas."
          },
          {
            "voice": "lucia",
            "text": "O sea, el estudio reporta que bajó, pero la magnitud no se puede citar."
          },
          {
            "voice": "narrador",
            "text": "Exacto. El estudio añade que solo 13.785,68 hectáreas, el 36,71 % del Distrito, tienen capacidad media o alta para sostener flujos ecológicos; en el cuerpo del documento, ese dato sale de un modelo para aves."
          },
          {
            "voice": "narrador",
            "text": "Quinto mensaje, en breve: importa la calidad de la vegetación del corredor, no solo que exista en el mapa."
          }
        ]
      },
      {
        "id": "m6",
        "type": "figure",
        "min": 13,
        "seVe": "Una tarjeta indica que tres de cada cuatro hectáreas de nueva urbanización, el 74,34 %, se sumaron en los corregimientos.",
        "figs": [
          "P2-C43",
          "P2-C42"
        ],
        "texts": {
          "t1": "MENSAJE PRINCIPAL · OCUPACIÓN DEL SUELO",
          "t2": "Medición de alta resolución · ganancia bruta",
          "t3": "Corregimientos",
          "t4": "La mayor parte del área del Distrito"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Sexto mensaje: entre 2017 y 2024, tres de cada cuatro hectáreas de nueva urbanización se sumaron en los corregimientos: el 74,34 %, según la medición de alta resolución del estudio."
          },
          {
            "voice": "narrador",
            "text": "Para leer bien esa cifra, hay que recordar que los corregimientos abarcan la mayor parte del área del Distrito."
          },
          {
            "voice": "narrador",
            "text": "El cierre del estudio concluye que la apuesta de crecer hacia adentro, presente en los planes de ordenamiento desde 1999, se cumplió de manera parcial."
          }
        ]
      },
      {
        "id": "m6-lectura",
        "type": "dialogue",
        "min": 13,
        "seVe": "Desde un mirador, Hernán y Lucía ven cabeceras, áreas de expansión y condominios en las laderas, y un panel recuerda que otra medición usa otro método.",
        "figs": [],
        "texts": {
          "t1": "Cabeceras",
          "t2": "Áreas de expansión",
          "t3": "Condominios",
          "t4": "Otra medición, otro método"
        },
        "lines": [
          {
            "voice": "hernan",
            "text": "Entonces, ¿todo ese crecimiento es ocupación informal?",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No todo: según el estudio, gran parte es suburbanización, como la de Santa Elena con condominios cerrados, y también hay urbanización formal en cabeceras y áreas de expansión."
          },
          {
            "voice": "narrador",
            "text": "Además, otra medición del estudio, con otro método, concentra las señales de cambio en el corredor central y sus ejes viales; el documento declara que son métricas distintas y pide no combinarlas."
          }
        ]
      },
      {
        "id": "m7",
        "type": "figure",
        "min": 14,
        "seVe": "Una tarjeta indica que cerca del 92 % del caudal concesionado a tres embalses viene de cuencas externas, junto a tres barras: 9,11; 4,30 y 1,15 metros cúbicos por segundo.",
        "figs": [
          "P2-C47",
          "P2-C48",
          "P2-C49",
          "P2-C50"
        ],
        "texts": {
          "t1": "MENSAJE PRINCIPAL · INTERDEPENDENCIA REGIONAL",
          "t2": "La Fe",
          "t3": "Río Grande II",
          "t4": "Piedras Blancas"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Séptimo mensaje: según el estudio, con datos de EPM, cerca del 92 % del caudal concesionado a los embalses que abastecen al Distrito proviene de cuencas externas."
          },
          {
            "voice": "narrador",
            "text": "Solo Piedras Blancas, el de menor caudal concesionado de los tres, recibe aportes desde suelo del Distrito."
          },
          {
            "voice": "lucia",
            "text": "¿El 92 % del agua que consumimos viene de fuera?",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No: es el caudal concesionado a tres embalses, el agua autorizada para captar; no es lo mismo que el agua consumida."
          }
        ]
      },
      {
        "id": "m7-gobernanza",
        "type": "explain",
        "min": 12,
        "seVe": "Un esquema muestra los tres embalses y sus tuberías hacia el valle, y una barra indica que no existe un instrumento de gobernanza que vincule las decisiones.",
        "figs": [],
        "texts": {
          "t1": "SIN UN INSTRUMENTO DE GOBERNANZA QUE VINCULE LAS DECISIONES",
          "t2": "Comité de integración territorial · recomendación",
          "t3": "CASI TODA EL AGUA CONCESIONADA NACE EN LA REGIÓN"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, no existe un instrumento de gobernanza que vincule las decisiones del Plan de Ordenamiento Territorial de Medellín con las de la Gobernación, el Área Metropolitana y los municipios de los corredores regionales."
          },
          {
            "voice": "narrador",
            "text": "El estudio recomienda un comité de integración territorial o un esquema asociativo; es una recomendación, no una decisión."
          },
          {
            "voice": "narrador",
            "text": "Séptimo mensaje, en breve: casi toda el agua concesionada a los embalses que abastecen a Medellín nace en cuencas de otros municipios."
          }
        ]
      },
      {
        "id": "m8",
        "type": "explain",
        "min": 14,
        "seVe": "Seis tarjetas con las contradicciones del modelo de ocupación rodean una etiqueta central: un mismo sistema.",
        "figs": [
          "P2-C54"
        ],
        "texts": {
          "t1": "MENSAJE PRINCIPAL · UN MISMO SISTEMA",
          "t2": "Protección ambiental frente a densificación en suelo consolidado",
          "t3": "Borde rural de protección frente a borde rural de expansión",
          "t4": "Ronda hídrica como determinante frente a condicionante de densidad",
          "t5": "Capacidad de soporte urbano frente a restricción ambiental en media ladera",
          "t6": "Densificación como eficiencia frente a densificación como externalidad",
          "t7": "Autonomía distrital frente a dependencia funcional regional",
          "t8": "Un mismo sistema",
          "t9": "Su instancia"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Octavo mensaje: el diagnóstico identificó seis contradicciones estructurales en el modelo de ocupación."
          },
          {
            "voice": "narrador",
            "text": "Por ejemplo, proteger las quebradas y, a la vez, densificar lo ya construido; o el borde rural como protección frente al borde rural como expansión."
          },
          {
            "voice": "narrador",
            "text": "Para cada una, el estudio propone un criterio de conciliación y la instancia donde debe resolverse; son propuestas técnicas."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 10,
        "seVe": "Cinco decisiones —quebradas, borde rural, densificación, riesgo, agua y alimentos— se unen bajo la frase final: un mismo sistema.",
        "figs": [],
        "texts": {
          "t1": "Quebradas",
          "t2": "Borde rural",
          "t3": "Densificar",
          "t4": "Riesgo",
          "t5": "Agua y alimentos",
          "t6": "UN MISMO SISTEMA"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Los ocho mensajes son insumos técnicos para la revisión del Plan de Ordenamiento Territorial; las decisiones corresponden al Distrito."
          },
          {
            "voice": "narrador",
            "text": "En palabras sencillas: proteger las quebradas, controlar el borde rural, densificar, gestionar el riesgo y asegurar agua y alimentos son decisiones que giran sobre un mismo sistema territorial."
          }
        ]
      }
    ],
    "checkpoints": [
      {
        "after": "m2-bases",
        "question": "El 40,93 % y el 37,23 % de amenaza alta por movimientos en masa…",
        "options": [
          "Son la misma medida con distinto redondeo",
          "Miden superficies distintas con bases distintas",
          "Se suman para obtener el total"
        ],
        "answer": 1,
        "explain": "Una sale del mapa combinado y mide el área urbanizada; la otra sale de la zonificación oficial y mide todo el Distrito.",
        "hint": "La clave está en la superficie que mide cada porcentaje."
      },
      {
        "after": "m6-lectura",
        "question": "Que tres de cada cuatro hectáreas nuevas quedaran en los corregimientos significa que…",
        "options": [
          "Los corregimientos crecieron mucho más que las comunas respecto a su área",
          "Allí quedó el 74,34 % de la ganancia total, en territorios que abarcan la mayor parte del Distrito",
          "Todo ese crecimiento fue ocupación informal"
        ],
        "answer": 1,
        "explain": "Es la parte de la ganancia total que quedó en los corregimientos, que abarcan la mayor parte del área del Distrito; no mide cuánto creció cada territorio respecto a su área.",
        "hint": "La clave está en cuánto territorio ocupan los corregimientos."
      }
    ],
    "pauses": []
  },
  {
    "id": "v3",
    "slug": "ganancia-urbana",
    "title": "¿Hacia dónde creció Medellín?",
    "unit": "Punto 3 · medición A",
    "target": [
      180,
      240
    ],
    "poster": {
      "scene": "corregimientos",
      "p": 0.6
    },
    "chapters": [
      {
        "title": "Cuánto creció",
        "from": "gancho"
      },
      {
        "title": "Dónde creció",
        "from": "corregimientos"
      },
      {
        "title": "Qué propone el estudio",
        "from": "bordes"
      }
    ],
    "scenes": [
      {
        "id": "gancho",
        "type": "title",
        "min": 9,
        "seVe": "El título pregunta hacia dónde creció Medellín y una tarjeta muestra 3.491,58 hectáreas de nuevas áreas urbanizadas entre 2017 y 2024.",
        "figs": [
          "P3-C01"
        ],
        "texts": {
          "t1": "¿HACIA DÓNDE CRECIÓ MEDELLÍN?",
          "t2": "medición de alta resolución, 2017–2024"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "¿Hacia dónde creció Medellín entre 2017 y 2024?"
          },
          {
            "voice": "narrador",
            "text": "Con imágenes de satélite de alta resolución, el estudio midió 3.491,58 hectáreas de nuevas áreas urbanizadas en ese periodo."
          }
        ]
      },
      {
        "id": "metodo",
        "type": "explain",
        "min": 10,
        "seVe": "En el panel del mapa, celdas que eran campo o bosque pasan a ser área construida, con la nota de que la exactitud no está reportada.",
        "figs": [],
        "texts": {
          "t1": "Campo, bosque u otra cobertura",
          "t2": "Área construida",
          "t3": "Con matiz",
          "t4": "Exactitud no reportada"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "La medición marca los lugares que pasaron de campo, bosque u otra cobertura natural a ser área construida."
          },
          {
            "voice": "narrador",
            "text": "El documento no reporta la exactitud de este mapa, y el estudio pide no combinar esta medición con otras de la expansión."
          }
        ]
      },
      {
        "id": "ritmo",
        "type": "figure",
        "min": 14,
        "seVe": "Dos barras muestran el ritmo anual de ganancia: 353,77 hectáreas por año en 2017–2021 y 722,19 en 2021–2024.",
        "figs": [
          "P3-C03",
          "P3-C04"
        ],
        "texts": {
          "t1": "2017–2021",
          "t2": "2021–2024",
          "t3": "Ritmos por año, no partes del total"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El ritmo anual se duplicó: pasó de 353,77 hectáreas por año en 2017–2021 a 722,19 en 2021–2024."
          },
          {
            "voice": "lucia",
            "text": "¿Y lo que se ganó en cada periodo suma el total?"
          },
          {
            "voice": "narrador",
            "text": "No: el documento advierte que lo ganado en los dos periodos no suma el acumulado y no explica la diferencia; por eso aquí solo se comparan los ritmos anuales."
          },
          {
            "voice": "narrador",
            "text": "En resumen: en el segundo periodo, el ritmo anual fue el doble."
          }
        ],
        "ficcion": true
      },
      {
        "id": "corregimientos",
        "type": "figure",
        "min": 14,
        "seVe": "Tarjetas muestran que el 74,34 % de lo ganado quedó en los corregimientos, que abarcan 27.524,42 de las 37.639,66 hectáreas, y que ganaron 9,43 % de su área, frente al 8,74 % en las comunas.",
        "figs": [
          "P3-C06",
          "P3-C05",
          "P3-C53",
          "P3-C54",
          "P3-C55",
          "P3-C56"
        ],
        "texts": {
          "t1": "Respecto a su área"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Tres de cada cuatro hectáreas nuevas, el 74,34 %, quedaron en los corregimientos."
          },
          {
            "voice": "narrador",
            "text": "Pero los corregimientos abarcan 27.524,42 de las 37.639,66 hectáreas del Distrito: respecto a su área, ganaron 9,43 %, y las comunas, 8,74 %."
          },
          {
            "voice": "narrador",
            "text": "Los corregimientos son las cinco divisiones de la zona rural de Medellín; las comunas, las dieciséis de su área urbana."
          }
        ]
      },
      {
        "id": "santa-elena",
        "type": "figure",
        "min": 13,
        "seVe": "Una tarjeta muestra que Santa Elena concentró 754,96 hectáreas, más de un tercio de lo ganado entre 2021 y 2024.",
        "figs": [
          "P3-C12"
        ],
        "texts": {
          "t1": "Suburbanización: condominios cerrados",
          "t2": "Urbanización formal: cabeceras y áreas de expansión"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Entre 2021 y 2024, Santa Elena concentró más de un tercio de lo ganado en el Distrito: 754,96 hectáreas."
          },
          {
            "voice": "hernan",
            "text": "¿Y todo eso es ocupación informal?",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No todo. Según el estudio, gran parte de la ganancia en los corregimientos es suburbanización, como la de Santa Elena con condominios cerrados; también hay urbanización formal, como la cabecera de San Antonio de Prado."
          }
        ]
      },
      {
        "id": "adentro",
        "type": "compare",
        "min": 13,
        "seVe": "A la izquierda, la apuesta de crecer hacia adentro, cerca del río; a la derecha, lo observado: crecimiento en corregimientos y laderas.",
        "figs": [],
        "texts": {
          "t1": "La apuesta del plan",
          "t2": "Crecer hacia adentro",
          "t3": "Lo observado",
          "t4": "Corregimientos y laderas",
          "t5": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El plan de ordenamiento apostaba por crecer hacia adentro: concentrar el crecimiento en el suelo ya urbanizado, sobre todo cerca del río."
          },
          {
            "voice": "narrador",
            "text": "El estudio concluye que esa apuesta se cumplió de manera parcial: la ocupación avanzó sobre los corregimientos y las laderas."
          }
        ]
      },
      {
        "id": "bordes",
        "type": "explain",
        "min": 12,
        "seVe": "En un borde de ladera, nuevas construcciones cortan un corredor de bosque, sellan zonas de recarga de agua y quedan en zonas de amenaza.",
        "figs": [],
        "texts": {
          "t1": "Zonas de recarga",
          "t2": "Amenaza",
          "t3": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, urbanizar los bordes reduce la función de los corredores ecológicos, aumenta la impermeabilización de las zonas de recarga de agua y expone a nuevos hogares a amenazas."
          }
        ]
      },
      {
        "id": "otras",
        "type": "explain",
        "min": 11,
        "seVe": "Tres carpetas representan tres mediciones distintas de la expansión, que no se suman ni se comparan.",
        "figs": [],
        "texts": {
          "t1": "Esta medición",
          "t2": "Mapas de coberturas",
          "t3": "Señales satelitales",
          "t4": "NO SE SUMAN NI SE COMPARAN",
          "t5": "Corredor central y occidente"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El estudio tiene otras dos mediciones de la expansión, con fuentes y métodos distintos; el documento pide no combinarlas con esta."
          },
          {
            "voice": "narrador",
            "text": "Una de ellas, la probabilidad de cambio urbano, ubica el cambio en el corredor central y el occidente, con otro método."
          }
        ]
      },
      {
        "id": "propuesta",
        "type": "explain",
        "min": 12,
        "seVe": "Una línea marca el borde urbano-rural como límite del crecimiento y un satélite señala alertas tempranas, junto al sello de insumo técnico.",
        "figs": [],
        "texts": {
          "t1": "Borde urbano-rural como límite",
          "t2": "Alerta temprana"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Como insumo para el Plan de Ordenamiento Territorial, el POT, el estudio propone usar el borde entre la ciudad y el campo como límite del crecimiento y vigilar la urbanización con alertas tempranas por satélite."
          },
          {
            "voice": "narrador",
            "text": "Son propuestas técnicas: las decisiones sobre el modelo de ocupación corresponden al Distrito."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 9,
        "seVe": "Lucía y Hernán en la loma y la frase final: Medellín creció más hacia sus bordes que hacia adentro.",
        "figs": [],
        "texts": {
          "t1": "MEDELLÍN CRECIÓ MÁS HACIA SUS BORDES QUE HACIA ADENTRO"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "En resumen, según esta medición, entre 2017 y 2024 Medellín creció más hacia sus bordes que hacia adentro."
          }
        ]
      }
    ],
    "checkpoints": [
      {
        "after": "adentro",
        "question": "Según el cierre del estudio, la apuesta de crecer hacia adentro…",
        "options": [
          "Se cumplió por completo",
          "Se cumplió de manera parcial",
          "No estaba en el plan"
        ],
        "answer": 1,
        "explain": "El cierre concluye que «esa apuesta se cumplió de manera parcial», porque la ocupación avanzó sobre los corregimientos y las laderas.",
        "hint": "La respuesta está en la expresión que usa el cierre del estudio."
      }
    ],
    "pauses": []
  },
  {
    "id": "v4",
    "slug": "piso-duro",
    "title": "¿Cuánto creció el suelo construido en el Valle de Aburrá?",
    "unit": "Punto 3 · medición B",
    "target": [
      180,
      270
    ],
    "poster": {
      "scene": "medellin",
      "p": 0.6
    },
    "chapters": [
      {
        "title": "Qué mide",
        "from": "gancho"
      },
      {
        "title": "Lo que muestran los mapas",
        "from": "medellin"
      },
      {
        "title": "Bordes y propuestas",
        "from": "bordes"
      }
    ],
    "scenes": [
      {
        "id": "gancho",
        "type": "title",
        "min": 9,
        "seVe": "El título pregunta cuánto creció el suelo construido en el valle y una tarjeta muestra un aumento de 71,25 % en los otros nueve municipios.",
        "figs": [
          "P3-C23"
        ],
        "texts": {
          "t1": "¿CUÁNTO CRECIÓ EL SUELO CONSTRUIDO?",
          "t2": "mapas de coberturas del Valle de Aburrá, 2017–2024"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "¿Cuánto creció el suelo construido en el Valle de Aburrá?"
          },
          {
            "voice": "narrador",
            "text": "Según los mapas de coberturas del valle, entre 2017 y 2024 las superficies duras crecieron 71,25 % en los otros nueve municipios del Valle de Aburrá."
          }
        ]
      },
      {
        "id": "piso-duro",
        "type": "explain",
        "min": 11,
        "seVe": "Construcciones, zonas industriales o comerciales, vías y una clase sin verificar se agrupan bajo el nombre de piso duro.",
        "figs": [],
        "texts": {
          "t1": "Construcciones",
          "t2": "Zonas industriales o comerciales",
          "t3": "Vías",
          "t4": "Una clase sin verificar",
          "t5": "PISO DURO",
          "t6": "Área cartografiada",
          "t7": "Cambio neto"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Se llama piso duro a las superficies selladas por construcciones, zonas industriales o comerciales y vías, según esos mapas; incluye además una clase cuyo contenido no se verificó."
          },
          {
            "voice": "narrador",
            "text": "Son áreas cartografiadas: superficies medidas sobre los mapas, sin corregir posibles errores de clasificación."
          },
          {
            "voice": "narrador",
            "text": "Y el cambio neto es la diferencia entre lo que se ganó y lo que se perdió de una cobertura entre dos fechas."
          }
        ]
      },
      {
        "id": "fuente",
        "type": "explain",
        "min": 10,
        "seVe": "Tres mapas de coberturas del valle, de 2017, 2021 y 2024, se apilan con la nota de que el documento no indica quién los produjo.",
        "figs": [],
        "texts": {
          "t1": "2017",
          "t2": "2021",
          "t3": "2024",
          "t4": "Productor de las capas no indicado"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Esta medición compara mapas de coberturas del valle de 2017, 2021 y 2024, hechos con la metodología Corine Land Cover."
          },
          {
            "voice": "narrador",
            "text": "El documento no indica quién produjo esas capas."
          },
          {
            "voice": "narrador",
            "text": "¿Qué muestran esos mapas?"
          }
        ]
      },
      {
        "id": "medellin",
        "type": "compare",
        "min": 14,
        "seVe": "Dos columnas, con la misma fuente: Medellín sumó 692,65 hectáreas de piso duro, 6,32 % más que en 2017, y los otros nueve municipios, 6.987,28 hectáreas, 71,25 % más.",
        "figs": [
          "P3-C21",
          "P3-C22",
          "P3-C23"
        ],
        "texts": {
          "t1": "Medellín",
          "t2": "Otros nueve municipios",
          "t3": "Áreas cartografiadas",
          "t4": "Otras mediciones · no se combinan"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Con la misma fuente, el piso duro de Medellín creció 6,32 %: 692,65 hectáreas más que en 2017; en los otros nueve municipios, el cambio fue de 6.987,28 hectáreas más."
          },
          {
            "voice": "lucia",
            "text": "Entonces, ¿los demás municipios crecieron mucho más que Medellín?"
          },
          {
            "voice": "narrador",
            "text": "En conjunto y con esta fuente, sí; pero son áreas cartografiadas, y parte del cambio puede reflejar diferencias en el detalle de los mapas y en la representación de las vías."
          },
          {
            "voice": "narrador",
            "text": "El estudio tiene otras dos mediciones de la expansión, con otras fuentes y métodos; el documento pide no combinarlas con esta."
          }
        ],
        "ficcion": true
      },
      {
        "id": "detalle",
        "type": "figure",
        "min": 13,
        "seVe": "Una tarjeta indica que el 84,22 % del cambio neto está en municipios con cambios de detalle cartográfico, junto a un esquema del mismo terreno dibujado con poco y con mucho detalle.",
        "figs": [
          "P3-C27"
        ],
        "texts": {
          "t1": "Menos detalle",
          "t2": "Más detalle",
          "t3": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El 84,22 % del cambio neto de 2017–2024 está en municipios cuyos mapas cambiaron de nivel de detalle; allí, el cambio puede reflejar también diferencias de detalle cartográfico."
          },
          {
            "voice": "narrador",
            "text": "Si un mapa se dibuja con más detalle que el anterior, puede aparecer un cambio que no ocurrió en el terreno."
          }
        ]
      },
      {
        "id": "vias",
        "type": "explain",
        "min": 10,
        "seVe": "Un esquema muestra la misma vía dibujada de forma distinta en dos mapas.",
        "figs": [],
        "texts": {
          "t1": "2017",
          "t2": "2024",
          "t3": "Misma vía, otra representación",
          "t4": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Algo parecido ocurre con las vías: el piso duro las incluye, y su representación entre un mapa y otro no se verificó."
          },
          {
            "voice": "narrador",
            "text": "Por eso, parte del cambio puede reflejar diferencias de representación y no solo construcción nueva."
          }
        ]
      },
      {
        "id": "norte",
        "type": "explain",
        "min": 12,
        "seVe": "En un esquema del valle, el norte aparece destacado con Barbosa, Girardota y Copacabana, y una nota recuerda el cambio de detalle de los mapas.",
        "figs": [],
        "texts": {
          "t1": "Barbosa",
          "t2": "Girardota",
          "t3": "Copacabana",
          "t4": "Con matiz",
          "t5": "Detalle cartográfico",
          "t6": "Territorio, no gestión municipal"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, el crecimiento se concentró en el norte del valle, en Barbosa, Girardota y Copacabana, aunque parte de esos cambios puede responder a diferencias de detalle cartográfico."
          },
          {
            "voice": "narrador",
            "text": "Estas comparaciones describen el territorio, no la gestión de cada municipio."
          },
          {
            "voice": "narrador",
            "text": "En breve: con esta fuente, el norte del valle concentró el crecimiento."
          }
        ]
      },
      {
        "id": "bordes",
        "type": "figure",
        "min": 13,
        "seVe": "Una tarjeta indica que el 36,77 % del límite con Medellín tiene coberturas artificiales a ambos lados, incluidas las vías.",
        "figs": [
          "P3-C32"
        ],
        "texts": {
          "t1": "Coberturas artificiales a ambos lados · incluye vías"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "En el límite con Medellín, el 36,77 % de la longitud tiene coberturas artificiales a ambos lados, incluidas las vías."
          },
          {
            "voice": "hernan",
            "text": "O sea que Medellín y sus vecinos ya son una sola ciudad.",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No: esa continuidad incluye la red vial y no equivale a una ciudad continua."
          }
        ]
      },
      {
        "id": "propuesta",
        "type": "explain",
        "min": 12,
        "seVe": "Tres tarjetas resumen las propuestas: seguir la expansión con la misma fuente, evaluar la exactitud de los cambios y acordar reglas comunes para los bordes.",
        "figs": [],
        "texts": {
          "t1": "Misma fuente cartográfica",
          "t2": "Evaluar la exactitud de los cambios",
          "t3": "Reglas comunes para los bordes"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Como insumo para el Plan de Ordenamiento Territorial y la agenda metropolitana, el estudio propone seguir la expansión con la misma fuente cartográfica, evaluar la exactitud de los cambios y acordar reglas comunes para los bordes."
          },
          {
            "voice": "narrador",
            "text": "Son propuestas técnicas, no decisiones adoptadas."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 10,
        "seVe": "El sello de área cartografiada y la frase final: el norte del valle es el lugar donde se decidirá la próxima década de la ocupación metropolitana.",
        "figs": [],
        "texts": {
          "t1": "EL NORTE DEL VALLE ES EL LUGAR DONDE SE DECIDIRÁ LA PRÓXIMA DÉCADA DE LA OCUPACIÓN METROPOLITANA"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Estas cifras son áreas cartografiadas: superficies medidas sobre los mapas."
          },
          {
            "voice": "narrador",
            "text": "Con esa cautela, para el estudio, el norte del valle es el lugar donde se decidirá la próxima década de la ocupación metropolitana."
          }
        ]
      }
    ],
    "checkpoints": [],
    "pauses": []
  },
  {
    "id": "v5",
    "slug": "probabilidad-cambio",
    "title": "¿Dónde muestran los satélites señales de urbanización?",
    "unit": "Punto 3 · medición C",
    "target": [
      120,
      180
    ],
    "poster": {
      "scene": "donde",
      "p": 0.6
    },
    "chapters": [
      {
        "title": "Cómo se detecta",
        "from": "gancho"
      },
      {
        "title": "Dónde aparecen las señales",
        "from": "donde"
      },
      {
        "title": "Qué propone el estudio",
        "from": "otras"
      }
    ],
    "scenes": [
      {
        "id": "gancho",
        "type": "title",
        "min": 9,
        "seVe": "El título pregunta dónde muestran los satélites señales de urbanización y una tarjeta indica 851 hectáreas de alta y 2.720 de media probabilidad, cerca del 9 % del Distrito.",
        "figs": [
          "P3-C36",
          "P3-C37"
        ],
        "texts": {
          "t1": "¿DÓNDE MUESTRAN LOS SATÉLITES SEÑALES DE URBANIZACIÓN?"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "¿Dónde muestran los satélites señales de urbanización?"
          },
          {
            "voice": "narrador",
            "text": "Entre 2014 y 2024, las señales satelitales muestran alta probabilidad de cambio urbano en 851 hectáreas de Medellín y media en 2.720; juntas suman cerca del 9 % del Distrito."
          }
        ]
      },
      {
        "id": "senales",
        "type": "explain",
        "min": 11,
        "seVe": "En el panel del mapa, baja la vegetación y sube lo construido en dos periodos seguidos, lo que se exige para una señal de alta confianza.",
        "figs": [],
        "texts": {
          "t1": "Baja la vegetación",
          "t2": "Sube lo construido",
          "t3": "Segundo periodo",
          "t4": "Alta confianza"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El estudio combina índices de imágenes Landsat: si la vegetación baja y lo construido sube, aparece una señal de cambio."
          },
          {
            "voice": "narrador",
            "text": "Para la alta confianza, el cambio debe repetirse en el mismo sentido en dos periodos."
          }
        ]
      },
      {
        "id": "luces",
        "type": "explain",
        "min": 13,
        "seVe": "Luces nocturnas de una sola fecha refuerzan algunas señales, y un sitio sin luz puede ser una urbanización reciente sin alumbrado.",
        "figs": [
          "P3-C36"
        ],
        "texts": {
          "t1": "Luces nocturnas · una sola fecha",
          "t2": "Sin alumbrado todavía",
          "t3": "Probabilidad, no confirmación"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Las luces nocturnas refuerzan la señal, pero son de una sola fecha, posterior al periodo: un sitio sin luz puede ser una urbanización reciente que aún no tiene alumbrado."
          },
          {
            "voice": "lucia",
            "text": "Entonces, ¿esas 851 hectáreas ya están urbanizadas?",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No necesariamente. En breve: son probabilidades de cambio, no áreas urbanizadas confirmadas."
          }
        ],
        "ficcion": true
      },
      {
        "id": "donde",
        "type": "explain",
        "min": 11,
        "seVe": "En un esquema del Distrito, las señales se agrupan en el corredor central y sus ejes viales, y también en el costado occidental.",
        "figs": [],
        "texts": {
          "t1": "Distrito de Medellín · esquema",
          "t2": "Corredor central y ejes viales",
          "t3": "Costado occidental",
          "t4": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, las señales se concentran en el corredor central del Distrito y sus ejes viales, con concentraciones adicionales en el costado occidental."
          }
        ]
      },
      {
        "id": "no-concluyente",
        "type": "explain",
        "min": 10,
        "seVe": "Algunas zonas aparecen como cambio no concluyente, que no se atribuye a urbanización.",
        "figs": [],
        "texts": {
          "t1": "Cambio no concluyente",
          "t2": "No se atribuye a urbanización"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Otra parte del territorio queda como cambio no concluyente: un cambio que no se puede atribuir con seguridad a urbanización."
          }
        ]
      },
      {
        "id": "metropolitano",
        "type": "figure",
        "min": 12,
        "seVe": "Dos tarjetas muestran, para el área metropolitana, 2.900,8 hectáreas de alta y 8.471,8 hectáreas de media probabilidad de cambio urbano.",
        "figs": [
          "P3-C40",
          "P3-C41"
        ],
        "lines": [
          {
            "voice": "narrador",
            "text": "En el área metropolitana, con un método análogo, 2.900,8 hectáreas tienen alta y 8.471,8 hectáreas media probabilidad de cambio urbano entre 2014 y 2024."
          }
        ]
      },
      {
        "id": "no-solo-urbano",
        "type": "explain",
        "min": 11,
        "seVe": "Superficies mineras, suelo desnudo y posibles usos agropecuarios también dan señales altas, junto a la urbanización.",
        "figs": [],
        "texts": {
          "t1": "Superficies mineras",
          "t2": "Suelo desnudo",
          "t3": "Posibles usos agropecuarios",
          "t4": "Urbanización",
          "t5": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "En el área metropolitana, según el documento, las zonas con mayor probabilidad no responden solo a urbanización: también hay superficies mineras, suelo desnudo y posibles usos agropecuarios."
          }
        ]
      },
      {
        "id": "otras",
        "type": "explain",
        "min": 12,
        "seVe": "Tres carpetas representan tres mediciones distintas; la de alta resolución ubica la mayor parte del crecimiento en los corregimientos.",
        "figs": [],
        "texts": {
          "t1": "Esta medición",
          "t2": "Alta resolución",
          "t3": "Mapas de coberturas",
          "t4": "NO SE SUMAN NI SE COMPARAN",
          "t5": "Corregimientos"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Esta medición ubica el cambio en lugares distintos de las otras mediciones del estudio, que usan otros métodos y fuentes."
          },
          {
            "voice": "narrador",
            "text": "La medición de alta resolución, por ejemplo, ubica la mayor parte del crecimiento en los corregimientos; el documento pide no combinarlas."
          }
        ]
      },
      {
        "id": "propuesta",
        "type": "explain",
        "min": 11,
        "seVe": "Un satélite hace pasadas periódicas y marca alertas tempranas de urbanización, junto al sello de insumo técnico.",
        "figs": [],
        "texts": {
          "t1": "Seguimiento periódico",
          "t2": "Alertas tempranas de urbanización"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Como insumo para el Plan de Ordenamiento Territorial, el estudio propone un seguimiento periódico con teledetección, es decir, con imágenes de satélite, y alertas tempranas de urbanización con sensores remotos."
          },
          {
            "voice": "narrador",
            "text": "Son propuestas técnicas, no decisiones adoptadas."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 9,
        "seVe": "Aparece la frase final: son probabilidades, no áreas urbanizadas confirmadas.",
        "figs": [],
        "texts": {
          "t1": "SON PROBABILIDADES, NO ÁREAS URBANIZADAS CONFIRMADAS"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "En resumen: estas cifras son probabilidades de cambio urbano, no áreas urbanizadas confirmadas, y las decisiones corresponden al Distrito."
          }
        ]
      }
    ],
    "checkpoints": [
      {
        "after": "no-solo-urbano",
        "question": "Una zona con alta probabilidad de cambio urbano es…",
        "options": [
          "Un área urbanizada confirmada",
          "Un sitio donde las señales satelitales indican que es probable que se haya urbanizado",
          "Un sitio donde la norma prohíbe construir"
        ],
        "answer": 1,
        "explain": "Es una señal satelital de probabilidad; puede incluir otros cambios, como minería o suelo desnudo, y no confirma que el sitio esté urbanizado.",
        "hint": "La clave está en la palabra «probabilidad»."
      }
    ],
    "pauses": []
  },
  {
    "id": "v6",
    "slug": "estructura-ecologica",
    "title": "La estructura ecológica de Medellín: qué cambió y cómo se propone actualizarla",
    "unit": "Punto 4",
    "target": [
      210,
      300
    ],
    "poster": {
      "scene": "corredor",
      "p": 0.6
    },
    "chapters": [
      {
        "title": "Qué es la estructura ecológica",
        "from": "gancho"
      },
      {
        "title": "Qué cambió",
        "from": "perdida"
      },
      {
        "title": "Cómo se propone actualizarla",
        "from": "determinantes"
      },
      {
        "title": "Más allá del Distrito",
        "from": "metropolitana"
      }
    ],
    "scenes": [
      {
        "id": "gancho",
        "type": "title",
        "min": 10,
        "seVe": "El corte del valle muestra áreas protegidas, ríos y quebradas, humedales, montañas y corredores bajo el título de la estructura ecológica principal.",
        "figs": [],
        "texts": {
          "t1": "LA ESTRUCTURA ECOLÓGICA PRINCIPAL",
          "t2": "qué cambió y cómo se propone actualizarla",
          "t3": "Áreas protegidas",
          "t4": "Ríos y quebradas",
          "t5": "Humedales",
          "t6": "Montañas",
          "t7": "Corredores"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "La Estructura Ecológica Principal es la red de áreas protegidas, ríos, quebradas, humedales, montañas y corredores que sostiene los procesos ecológicos de Medellín."
          }
        ]
      },
      {
        "id": "vigente",
        "type": "figure",
        "min": 14,
        "seVe": "Una tarjeta muestra las 22.956,09 hectáreas de la estructura vigente de 2014 y, al lado, la estructura complementaria de segundo nivel.",
        "figs": [
          "P4-C01"
        ],
        "texts": {
          "t1": "Norma vigente",
          "t2": "Con matiz",
          "t3": "Estructura Ecológica Complementaria · segundo nivel",
          "t4": "El documento no reporta el área de la propuesta"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, la delimitación vigente, del Acuerdo 48 de 2014, abarca 22.956,09 hectáreas; hay además una estructura complementaria, de segundo nivel, que apoya y conecta a la principal."
          },
          {
            "voice": "lucia",
            "text": "¿Esa es también el área de la nueva estructura que se propone?",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No: es la de la estructura vigente. El documento no reporta el área total de la delimitación que propone."
          }
        ],
        "ficcion": true
      },
      {
        "id": "calidad",
        "type": "explain",
        "min": 11,
        "seVe": "Un parche de bosque conserva su forma mientras sus coberturas se vuelven más ralas: cambia la calidad.",
        "figs": [],
        "texts": {
          "t1": "La forma se mantiene",
          "t2": "Cambia la calidad",
          "t3": "¿QUÉ CAMBIÓ ENTRE 2014 Y 2024?",
          "t4": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Para el estudio, la principal tensión no está en perder la estructura como sistema, sino en la transformación gradual de la calidad de sus coberturas."
          },
          {
            "voice": "narrador",
            "text": "¿Qué cambió entre 2014 y 2024?"
          }
        ]
      },
      {
        "id": "perdida",
        "type": "figure",
        "min": 13,
        "seVe": "Una barra de 7.385 hectáreas con pérdida de vegetación destaca las 4.557,7, cerca del 62 %, que ocurrieron en suelos con capacidad para servicios ecosistémicos.",
        "figs": [
          "P4-C13",
          "P4-C14"
        ],
        "texts": {
          "t1": "Suelos con capacidad para servicios ecosistémicos"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Entre 2014 y 2024, el estudio detectó 7.385 hectáreas con pérdida de vegetación."
          },
          {
            "voice": "narrador",
            "text": "Cerca del 62 %, 4.557,7 hectáreas, ocurrió en suelos con capacidad para sostener servicios como agua, biodiversidad o alimentos."
          }
        ]
      },
      {
        "id": "sin-alarma",
        "type": "dialogue",
        "min": 12,
        "seVe": "Desde el mirador, Hernán pregunta si la estructura se acaba; en la ladera rural hay bosques que se recuperan y corredores con vacíos.",
        "figs": [],
        "texts": {
          "t1": "Esquema"
        },
        "lines": [
          {
            "voice": "hernan",
            "text": "¿Entonces la estructura ecológica se está acabando?",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No es lo que dice el estudio: la principal tensión está en la calidad de las coberturas, no en perder la estructura, y en la estructura rural también hay recuperación de coberturas."
          }
        ]
      },
      {
        "id": "corredor",
        "type": "compare",
        "min": 12,
        "seVe": "A la izquierda, un corredor dibujado en el mapa; a la derecha, el corredor en el territorio, con vacíos.",
        "figs": [],
        "texts": {
          "t1": "En el mapa",
          "t2": "dibujado",
          "t3": "En el territorio",
          "t4": "en el territorio"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Un corredor dibujado no garantiza un corredor que funcione: su efectividad depende también de la calidad de la vegetación que lo conforma, no solo de que exista en el mapa."
          }
        ]
      },
      {
        "id": "aves",
        "type": "figure",
        "min": 12,
        "seVe": "Una tarjeta muestra 13.785,68 hectáreas, el 36,71 % del Distrito, con capacidad media alta para el desplazamiento de aves según un modelo.",
        "figs": [
          "P4-C21"
        ],
        "texts": {
          "t1": "Modelo para un ave"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según un modelo para aves, solo 13.785,68 hectáreas, el 36,71 % del Distrito, tienen capacidad media alta para su desplazamiento entre áreas naturales."
          }
        ]
      },
      {
        "id": "determinantes",
        "type": "figure",
        "min": 14,
        "seVe": "Una tarjeta indica diez determinantes ambientales posteriores a 2014, y varios de ellos aparecen sin incluir o solo en parte en la estructura de 2014.",
        "figs": [
          "P4-C29",
          "P4-C33"
        ],
        "texts": {
          "t1": "Planes de cuencas",
          "t2": "Humedales urbanos",
          "t3": "Corredores de conectividad",
          "t4": "Retiro de 30 m",
          "t5": "No incluido o solo en parte",
          "t6": "Retiro: franja libre a cada lado del cauce"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Desde 2014 se definieron diez determinantes ambientales: normas o decisiones de superior jerarquía que el plan de ordenamiento debe incorporar."
          },
          {
            "voice": "narrador",
            "text": "Varios no están incluidos, o solo en parte, en la estructura de 2014: los planes de cuencas, los humedales urbanos, los corredores de conectividad y el retiro de 30 metros, que el documento atribuye a la Sentencia T-529 de 2025."
          },
          {
            "voice": "narrador",
            "text": "Un retiro es la franja que se deja libre a cada lado de un río o una quebrada."
          }
        ]
      },
      {
        "id": "base-minima",
        "type": "explain",
        "min": 12,
        "seVe": "Un esquema muestra la estructura de 2014 como base mínima, con piezas nuevas que se suman y la estructura complementaria aparte.",
        "figs": [],
        "texts": {
          "t1": "Estructura de 2014 · base mínima",
          "t2": "Áreas de normas y estudios posteriores",
          "t3": "Estructura complementaria, aparte",
          "t4": "Propuesta: debe concertarse",
          "t5": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El estudio propone actualizar la estructura tomando la de 2014 como base mínima, sumando áreas de normas y estudios posteriores y separando la estructura complementaria."
          },
          {
            "voice": "narrador",
            "text": "La propuesta aún debe concertarse con las autoridades ambientales."
          }
        ]
      },
      {
        "id": "retiros",
        "type": "figure",
        "min": 14,
        "seVe": "Una tarjeta muestra 1.358,25 hectáreas que se incorporarían con el retiro de 30 m, y un esquema de quebrada con tramos ya ocupados.",
        "figs": [
          "P4-C35",
          "P4-C33"
        ],
        "texts": {
          "t1": "Tramos con ocupación",
          "t2": "No equivale necesariamente a área nueva"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Con el retiro mínimo de 30 metros, el elemento de ríos y quebradas incorporaría 1.358,25 hectáreas, incluidos sectores ya urbanizados; por eso el estudio recomienda tratar cada tramo según su grado de ocupación."
          },
          {
            "voice": "lucia",
            "text": "¿Esas hectáreas se suman todas a la estructura?"
          },
          {
            "voice": "narrador",
            "text": "No necesariamente: se incorporan a un elemento de la propuesta, y el documento no establece que sean un aumento neto de la estructura."
          },
          {
            "voice": "narrador",
            "text": "En breve: la actualización que propone el estudio parte de la estructura de 2014, y la adopción del retiro en el Plan de Ordenamiento Territorial está pendiente."
          }
        ],
        "scale": {
          "from": 0,
          "to": 30,
          "step": 5,
          "unit": "m"
        }
      },
      {
        "id": "metropolitana",
        "type": "figure",
        "min": 13,
        "seVe": "Una tarjeta muestra 5.915,18 hectáreas de conectividad metropolitana y un esquema une la estructura del Distrito con la del valle.",
        "figs": [
          "P4-C45"
        ],
        "texts": {
          "t1": "Corredores con los municipios vecinos"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, la estructura ecológica de Medellín no es autosuficiente."
          },
          {
            "voice": "narrador",
            "text": "El estudio propone un elemento de conectividad metropolitana que vincula 5.915,18 hectáreas de la estructura del plan metropolitano ubicadas en el Distrito, y coordinar corredores con los municipios vecinos."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 11,
        "seVe": "Lucía y Hernán en la loma y la frase final: no basta con dibujar la estructura en el mapa.",
        "figs": [],
        "texts": {
          "t1": "NO BASTA CON DIBUJARLA EN EL MAPA"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Es una propuesta técnica, no un acto administrativo: las decisiones corresponden al Distrito."
          },
          {
            "voice": "narrador",
            "text": "No basta con dibujar la estructura ecológica en el mapa: el estudio propone actualizarla y evaluarla por cómo funciona, no solo por lo que delimita."
          }
        ]
      }
    ],
    "checkpoints": [
      {
        "after": "aves",
        "question": "Las 13.785,68 hectáreas con capacidad media alta para flujos ecológicos salen de…",
        "options": [
          "Un conteo de aves en campo",
          "Un modelo para una especie patrón de ave",
          "La delimitación oficial de la estructura"
        ],
        "answer": 1,
        "explain": "Salen de un modelo para un ave generalista; el cierre del estudio lo generaliza como capacidad para sostener flujos ecológicos.",
        "hint": "La clave está en la herramienta que produjo la cifra."
      }
    ],
    "pauses": []
  },
  {
    "id": "v7",
    "slug": "riesgo",
    "title": "Amenaza, exposición y vulnerabilidad: así se lee el riesgo en Medellín",
    "unit": "Punto 5",
    "target": [
      210,
      300
    ],
    "poster": {
      "scene": "triada",
      "p": 0.7
    },
    "chapters": [
      {
        "title": "Tres palabras",
        "from": "gancho"
      },
      {
        "title": "Dos mapas, dos bases",
        "from": "dos-bases"
      },
      {
        "title": "Lo expuesto y lo vulnerable",
        "from": "exposicion"
      },
      {
        "title": "Del mapa a la decisión",
        "from": "condicion-riesgo"
      }
    ],
    "scenes": [
      {
        "id": "gancho",
        "type": "title",
        "min": 9,
        "seVe": "El título presenta tres palabras —amenaza, exposición y vulnerabilidad— junto a tres círculos que se cruzan.",
        "figs": [],
        "texts": {
          "t1": "AMENAZA, EXPOSICIÓN Y VULNERABILIDAD",
          "t2": "así se lee el riesgo"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "¿Una amenaza alta significa un riesgo alto? Para responder, el estudio usa tres palabras: amenaza, exposición y vulnerabilidad."
          }
        ]
      },
      {
        "id": "triada",
        "type": "explain",
        "min": 15,
        "seVe": "Tres círculos —amenaza, exposición y vulnerabilidad— se cruzan y en su intersección aparece la palabra riesgo.",
        "figs": [],
        "texts": {
          "t1": "Amenaza",
          "t2": "Exposición",
          "t3": "Vulnerabilidad",
          "t4": "Riesgo",
          "t5": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "La amenaza es la posibilidad de que ocurra un fenómeno, como un deslizamiento o una inundación, con fuerza suficiente para causar daños."
          },
          {
            "voice": "narrador",
            "text": "La exposición es lo que está en ese lugar: personas, viviendas, vías, equipamientos y ecosistemas."
          },
          {
            "voice": "narrador",
            "text": "La vulnerabilidad es qué tan propensos son las personas, los bienes y los territorios a sufrir daños, y qué tan capaces son de responder y recuperarse."
          },
          {
            "voice": "narrador",
            "text": "Y el riesgo son los daños o pérdidas que podrían ocurrir cuando una amenaza alcanza algo expuesto y vulnerable."
          }
        ]
      },
      {
        "id": "no-es-igual",
        "type": "dialogue",
        "min": 13,
        "seVe": "Una ladera con amenaza alta y poca ocupación tiene menos riesgo; si se llena de casas, el riesgo sube.",
        "figs": [],
        "texts": {
          "t1": "Amenaza alta, poca exposición",
          "t2": "Si se ocupa, sube el riesgo",
          "t3": "Esquema"
        },
        "lines": [
          {
            "voice": "lucia",
            "text": "Si una zona tiene amenaza alta, ¿su riesgo también es alto?"
          },
          {
            "voice": "narrador",
            "text": "No necesariamente: según el estudio, el riesgo puede ser bajo donde hay poca exposición y vulnerabilidad."
          },
          {
            "voice": "narrador",
            "text": "Pero ocupar esas zonas lo elevaría: una zona de bajo riesgo no es automáticamente una zona aprovechable."
          },
          {
            "voice": "narrador",
            "text": "En breve: amenaza alta no es lo mismo que riesgo alto."
          }
        ],
        "ficcion": true
      },
      {
        "id": "dos-bases",
        "type": "compare",
        "min": 15,
        "seVe": "Dos columnas separan el 40,93 % del área urbanizada, según el mapa combinado, y el 37,23 % del Distrito, según la zonificación oficial.",
        "figs": [
          "P5-C01",
          "P5-C04",
          "P5-C22"
        ],
        "texts": {
          "t1": "Área urbanizada · mapa combinado",
          "t2": "Todo el Distrito · zonificación oficial"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el mapa que combina dos estudios de amenaza, cuatro de cada diez hectáreas urbanizadas del Distrito, el 40,93 % del área urbanizada total, están en amenaza alta por movimientos en masa, sobre todo en las laderas."
          },
          {
            "voice": "narrador",
            "text": "Con otra base, la zonificación oficial de los Estudios Básicos de Amenaza, esa amenaza cubre el 37,23 % del Distrito."
          },
          {
            "voice": "narrador",
            "text": "No se suman ni se comparan: miden superficies distintas."
          }
        ]
      },
      {
        "id": "combinado",
        "type": "explain",
        "min": 13,
        "seVe": "En el panel, dos mapas de amenaza se superponen y cada celda conserva la categoría más alta de los dos.",
        "figs": [],
        "texts": {
          "t1": "Estudios Básicos de Amenaza",
          "t2": "Evaluación de riesgos climáticos de Medellín",
          "t3": "Alta",
          "t4": "Producto de diagnóstico, no zonificación oficial",
          "t5": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El mapa combinado toma, en cada lugar, la categoría más alta entre los Estudios Básicos de Amenaza y el proyecto de evaluación de riesgos climáticos de Medellín."
          },
          {
            "voice": "hernan",
            "text": "¿Y por qué quedarse con la más alta?"
          },
          {
            "voice": "narrador",
            "text": "Para no subestimar la amenaza, según el principio de precaución. Es un producto de diagnóstico, no la zonificación oficial."
          }
        ]
      },
      {
        "id": "exposicion",
        "type": "explain",
        "min": 13,
        "seVe": "Sobre el corte del valle aparecen población, área construida y equipamientos como hospitales, colegios y servicios de emergencia.",
        "figs": [],
        "texts": {
          "t1": "Población",
          "t2": "Área construida",
          "t3": "Equipamientos",
          "t4": "LO EXPUESTO"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Además de la amenaza, el estudio mira qué está expuesto: dónde vive la población, qué área está construida y dónde están equipamientos como hospitales, colegios y servicios de emergencia."
          }
        ]
      },
      {
        "id": "vulnerabilidad",
        "type": "explain",
        "min": 15,
        "seVe": "Una casa con etiquetas de ingresos, vivienda, educación, redes de apoyo y capacidad de adaptación muestra que la vulnerabilidad va más allá de las construcciones.",
        "figs": [],
        "texts": {
          "t1": "Ingresos",
          "t2": "Vivienda",
          "t3": "Educación",
          "t4": "Redes de apoyo",
          "t5": "Capacidad de adaptación",
          "t6": "Más allá de las construcciones",
          "t7": "Exposición: controlar la expansión",
          "t8": "Vulnerabilidad: alertas tempranas y mejores condiciones socioeconómicas",
          "t9": "En otro apartado del documento: mitigación y reasentamiento",
          "t10": "LO QUE HAY EN EL LUGAR Y CÓMO RESPONDE"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Para entender la vulnerabilidad, el estudio propone mirar más allá de las construcciones: ingresos, vivienda, educación, redes de apoyo y capacidad de adaptación de los territorios."
          },
          {
            "voice": "narrador",
            "text": "El ordenamiento puede actuar sobre la exposición, por ejemplo controlando la expansión, y sobre la vulnerabilidad, por ejemplo con alertas tempranas o mejores condiciones socioeconómicas."
          },
          {
            "voice": "narrador",
            "text": "En otro apartado, el mismo documento asocia la reducción de la vulnerabilidad con la mitigación y el reasentamiento."
          },
          {
            "voice": "narrador",
            "text": "En breve: el riesgo depende también de lo que hay en el lugar y de su capacidad de responder."
          }
        ]
      },
      {
        "id": "condicion-riesgo",
        "type": "explain",
        "min": 13,
        "seVe": "Una ladera con amenaza alta y casas se marca como área con condición de riesgo; de tres laderas parecidas, solo una tiene al lado una carpeta de estudio de detalle.",
        "figs": [],
        "texts": {
          "t1": "Área con condición de riesgo",
          "t2": "Estudio de detalle",
          "t3": "Sin estudio de detalle",
          "t4": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, las zonas de amenaza alta que ya están ocupadas se llaman áreas con condición de riesgo."
          },
          {
            "voice": "narrador",
            "text": "El estudio añade que la mayor parte del territorio expuesto aún no cuenta con estudios de detalle que definan si su riesgo es mitigable."
          }
        ]
      },
      {
        "id": "propuestas",
        "type": "explain",
        "min": 14,
        "seVe": "Tres tarjetas resumen las propuestas del estudio y aparece el sello de insumo técnico.",
        "figs": [],
        "texts": {
          "t1": "No aumentar densidades sobre amenaza alta por movimientos en masa en la media ladera",
          "t2": "Priorizar estudios de detalle en áreas con condición de riesgo",
          "t3": "Adaptación frente a inundaciones en el fondo del valle"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Entre sus propuestas, el estudio plantea no aumentar densidades sobre amenaza alta por movimientos en masa en la media ladera y priorizar estudios de detalle en las áreas con condición de riesgo."
          },
          {
            "voice": "narrador",
            "text": "Y, en el fondo del valle, exigir adaptación frente a las inundaciones."
          },
          {
            "voice": "narrador",
            "text": "Son insumos técnicos: los mapas orientan dónde se necesitan estudios de detalle, no definen el riesgo predio a predio, y las decisiones corresponden al Distrito."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 11,
        "seVe": "Lucía y Hernán en la loma y la frase final: el riesgo debe estructurar la clasificación del suelo y la intensidad de ocupación.",
        "figs": [],
        "texts": {
          "t1": "EL RIESGO DEBE ESTRUCTURAR LA CLASIFICACIÓN DEL SUELO Y LA INTENSIDAD DE OCUPACIÓN",
          "t2": "Conclusión del estudio"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, la amenaza es, en su mayoría, una condición del territorio."
          },
          {
            "voice": "narrador",
            "text": "El ordenamiento puede decidir dónde y con qué intensidad se ocupa y apoyar la reducción de la vulnerabilidad, con base en estudios técnicos."
          },
          {
            "voice": "narrador",
            "text": "Como concluye el estudio: el riesgo debe estructurar la clasificación del suelo y la intensidad de ocupación."
          }
        ]
      }
    ],
    "checkpoints": [
      {
        "after": "combinado",
        "question": "El 40,93 % del área urbanizada en amenaza alta por movimientos en masa proviene de…",
        "options": [
          "La zonificación oficial de los Estudios Básicos de Amenaza",
          "Un mapa que combina dos estudios y toma la categoría más alta",
          "Un conteo de viviendas afectadas"
        ],
        "answer": 1,
        "explain": "Sale del mapa combinado del diagnóstico; la zonificación oficial da otra cifra, el 37,23 % del Distrito, con otra base.",
        "hint": "La clave está en cuántos estudios se combinaron."
      }
    ],
    "pauses": []
  },
  {
    "id": "v8",
    "slug": "agua-alimentos-region",
    "title": "Medellín no se alimenta sola: agua, alimentos y región",
    "unit": "Punto 6",
    "target": [
      210,
      300
    ],
    "poster": {
      "scene": "agua",
      "p": 0.6
    },
    "chapters": [
      {
        "title": "Otras escalas",
        "from": "gancho"
      },
      {
        "title": "El agua, primer alimento",
        "from": "agua"
      },
      {
        "title": "Quién produce y quién come",
        "from": "campesinado"
      },
      {
        "title": "Lo que propone el estudio",
        "from": "propuesta"
      }
    ],
    "scenes": [
      {
        "id": "gancho",
        "type": "title",
        "min": 10,
        "seVe": "El título dice que Medellín no se alimenta sola, junto a tres escalas: el Distrito, el Valle de Aburrá y la región.",
        "figs": [],
        "texts": {
          "t1": "MEDELLÍN NO SE ALIMENTA SOLA",
          "t2": "agua, alimentos y región"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, la mayor parte del agua y de los alimentos de Medellín viene de fuera de su territorio."
          },
          {
            "voice": "narrador",
            "text": "Por eso el estudio mira al Distrito en otras escalas: el Valle de Aburrá, la región y el país."
          }
        ]
      },
      {
        "id": "fraccion",
        "type": "explain",
        "min": 14,
        "seVe": "Una canasta pequeña de producción local recibe alimentos de otras subregiones, otros departamentos y el exterior, en un esquema sin valores.",
        "figs": [],
        "texts": {
          "t1": "Producción de Medellín",
          "t2": "Otras subregiones",
          "t3": "Otros departamentos",
          "t4": "Exterior",
          "t5": "Esquema",
          "t6": "Dependencia alimentaria",
          "t7": "Sin cifra: medidas que no son equivalentes"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Lo que se cultiva en Medellín es una fracción mínima de los alimentos que demanda el Valle de Aburrá; la mayor parte llega de otras subregiones, de otros departamentos y del exterior."
          },
          {
            "voice": "lucia",
            "text": "¿Y qué tan mínima es esa fracción?"
          },
          {
            "voice": "narrador",
            "text": "El documento la expresa con varias cifras que miden cosas distintas y no son equivalentes; por eso aquí se usa la conclusión del estudio: es una fracción mínima de la demanda."
          }
        ],
        "ficcion": true
      },
      {
        "id": "carga",
        "type": "figure",
        "min": 12,
        "seVe": "Una tarjeta muestra cerca de 234.000 registros de viajes de carga de alimentos y productos agropecuarios dentro del Valle de Aburrá en 2025, con la nota de que cuenta viajes, no toneladas.",
        "figs": [
          "P6-C70"
        ],
        "texts": {
          "t1": "Cuenta viajes, no toneladas"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el Registro Nacional de Despachos de Carga, citado por el estudio, los alimentos y productos agropecuarios son el tipo de carga con más viajes registrados dentro del Valle de Aburrá."
          },
          {
            "voice": "narrador",
            "text": "Fueron cerca de 234.000 registros en 2025: un conteo de viajes de carga formal, no de toneladas."
          },
          {
            "voice": "narrador",
            "text": "¿Y el agua?"
          }
        ]
      },
      {
        "id": "agua",
        "type": "figure",
        "min": 12,
        "seVe": "Una tarjeta indica que cerca del 92 % del caudal concesionado a los embalses viene de cuencas fuera del Distrito, junto al sello: el agua es el primer alimento.",
        "figs": [
          "P6-C80"
        ],
        "lines": [
          {
            "voice": "narrador",
            "text": "Para el estudio, el agua es el primer alimento."
          },
          {
            "voice": "narrador",
            "text": "Según el estudio, con datos de EPM, cerca del 92 % del caudal concesionado a los embalses que abastecen al Distrito proviene de cuencas fuera de su territorio."
          }
        ]
      },
      {
        "id": "concesionado",
        "type": "dialogue",
        "min": 12,
        "seVe": "Hernán, en su huerta, comenta de dónde viene el agua mientras una tubería llega desde la montaña con la etiqueta caudal concesionado.",
        "figs": [
          "P6-C80"
        ],
        "texts": {
          "t1": "Caudal concesionado: agua autorizada para captar"
        },
        "lines": [
          {
            "voice": "hernan",
            "text": "O sea que el 92 % del agua que gastamos en la casa viene de otros municipios.",
            "misreading": true
          },
          {
            "voice": "narrador",
            "text": "No: cerca del 92 % se refiere al caudal concesionado, el agua que la autoridad ambiental autoriza captar para los embalses; no es lo mismo que el agua que se consume."
          }
        ]
      },
      {
        "id": "campesinado",
        "type": "figure",
        "min": 13,
        "seVe": "Tres tarjetas muestran cerca de 12.000 familias campesinas, 2.803 hogares productores caracterizados y 1.027 hectáreas aprovechadas en producción de alimentos.",
        "figs": [
          "P6-C42",
          "P6-C44",
          "P6-C57"
        ],
        "lines": [
          {
            "voice": "narrador",
            "text": "En los cinco corregimientos viven cerca de 12.000 familias campesinas, según la Alcaldía."
          },
          {
            "voice": "narrador",
            "text": "La caracterización de la FAO y la Alcaldía identificó 2.803 hogares productores de alimentos, que aprovechan efectivamente 1.027 hectáreas."
          }
        ]
      },
      {
        "id": "predios",
        "type": "figure",
        "min": 12,
        "seVe": "Una tarjeta muestra que el 94,7 % de los 18.493 predios rurales tiene menos de 4 hectáreas.",
        "figs": [
          "P6-C58"
        ],
        "texts": {
          "t1": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Además, el 94,7 % de los 18.493 predios rurales tiene menos de 4 hectáreas, por debajo del umbral que el estudio usa para una producción familiar viable."
          }
        ]
      },
      {
        "id": "inseguridad",
        "type": "figure",
        "min": 15,
        "seVe": "Tres tarjetas muestran que en 2025 el 51,4 % de los hogares de Medellín tuvo algún nivel de inseguridad alimentaria: 31,9 % leve, 12,9 % moderada y 6,7 % severa; en la zona rural, el 55,2 %.",
        "figs": [
          "P6-C64",
          "P6-C66",
          "P6-C65"
        ],
        "texts": {
          "t1": "Leve",
          "t2": "Moderada",
          "t3": "Severa",
          "t4": "Zona rural",
          "t5": "¿QUÉ PROPONE EL ESTUDIO?"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el Observatorio de Seguridad y Soberanía Alimentaria y Nutricional de Medellín, en 2025 el 51,4 % de los hogares de la ciudad tuvo algún nivel de inseguridad alimentaria."
          },
          {
            "voice": "narrador",
            "text": "La inseguridad alimentaria va desde la preocupación por no tener suficientes alimentos en el hogar hasta comer menos o pasar privaciones."
          },
          {
            "voice": "narrador",
            "text": "El 31,9 % leve, el 12,9 % moderada y el 6,7 % severa; en la zona rural, el 55,2 %."
          },
          {
            "voice": "narrador",
            "text": "Y el estudio advierte que quienes producen alimentos para la ciudad también enfrentan inseguridad alimentaria. ¿Qué propone para ordenar el territorio con esta realidad?"
          }
        ]
      },
      {
        "id": "propuesta",
        "type": "explain",
        "min": 13,
        "seVe": "Líneas de acuerdo unen el Distrito con la región y una barra pide una decisión sobre la estructura predial campesina, junto al sello de insumo técnico.",
        "figs": [],
        "texts": {
          "t1": "Acuerdos de reciprocidad",
          "t2": "EL ESTUDIO PIDE UNA DECISIÓN SOBRE LA ESTRUCTURA PREDIAL CAMPESINA",
          "t3": "reciprocidad territorial"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Como insumo para la revisión del Plan de Ordenamiento Territorial, el estudio recomienda acuerdos de reciprocidad con los municipios que abastecen al valle y una decisión explícita sobre la estructura predial campesina."
          },
          {
            "voice": "narrador",
            "text": "La reciprocidad territorial son acuerdos para que la ciudad compense o apoye a los municipios que le dan agua y alimentos, sin quitarles autonomía."
          }
        ]
      },
      {
        "id": "valor-rural",
        "type": "dialogue",
        "min": 12,
        "seVe": "En la huerta, Hernán y Lucía conversan sobre el valor del suelo rural: circuitos cortos, alimentos frescos e identidad campesina.",
        "figs": [],
        "texts": {
          "t1": "Circuitos cortos",
          "t2": "Alimentos frescos",
          "t3": "Identidad campesina"
        },
        "lines": [
          {
            "voice": "hernan",
            "text": "Si la mayor parte viene de fuera, ¿para qué cuidar el campo de Medellín?"
          },
          {
            "voice": "narrador",
            "text": "Según el estudio, el valor del suelo rural no está en cubrir todo el consumo, sino en sostener circuitos cortos, alimentos frescos, identidad campesina y resiliencia barrial y corregimental."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 10,
        "seVe": "Aparece la frase final: la soberanía alimentaria empieza por la soberanía hídrica.",
        "figs": [],
        "texts": {
          "t1": "LA SOBERANÍA ALIMENTARIA EMPIEZA POR LA SOBERANÍA HÍDRICA"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "La soberanía alimentaria es la capacidad de un territorio de decidir cómo produce, distribuye y consume sus alimentos."
          },
          {
            "voice": "narrador",
            "text": "Como dice el estudio, la soberanía alimentaria empieza por la soberanía hídrica."
          },
          {
            "voice": "narrador",
            "text": "Las propuestas son insumos técnicos; las decisiones corresponden al Distrito."
          }
        ]
      }
    ],
    "checkpoints": [
      {
        "after": "concesionado",
        "question": "La cifra de cerca del 92 % que menciona el estudio se refiere a…",
        "options": [
          "El agua que se consume en los hogares",
          "El caudal concesionado a los embalses que abastecen al Distrito",
          "La lluvia que cae en el valle"
        ],
        "answer": 1,
        "explain": "El estudio la calcula con datos de EPM sobre el agua que la autoridad ambiental autoriza captar para los tres embalses; el documento usa otras medidas para el agua consumida.",
        "hint": "La clave está en la palabra «concesionado»."
      }
    ],
    "pauses": []
  },
  {
    "id": "v9",
    "slug": "anticipar-coordinar",
    "title": "Medellín 2040: anticiparse al cambio y coordinarse con el valle",
    "unit": "Punto 7",
    "target": [
      180,
      270
    ],
    "poster": {
      "scene": "ruta",
      "p": 0.7
    },
    "chapters": [
      {
        "title": "Hechos metropolitanos",
        "from": "gancho"
      },
      {
        "title": "Pensar el 2040",
        "from": "ruta"
      },
      {
        "title": "Gobernanza",
        "from": "anticipatoria"
      },
      {
        "title": "Lo que queda para la revisión",
        "from": "asuntos"
      }
    ],
    "scenes": [
      {
        "id": "gancho",
        "type": "title",
        "min": 10,
        "seVe": "El título habla de Medellín en 2040, de anticiparse al cambio y de coordinarse con el valle, junto a tres escalas de decisión.",
        "figs": [],
        "texts": {
          "t1": "MEDELLÍN 2040",
          "t2": "anticiparse al cambio y coordinarse con el valle"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, muchos asuntos de Medellín dependen de todo el valle y de la región, pero las decisiones todavía no siempre se comparten."
          }
        ]
      },
      {
        "id": "hechos",
        "type": "figure",
        "min": 13,
        "seVe": "Una tarjeta indica, con un dato preliminar, que entre 1995 y 2019 el Área Metropolitana declaró 20 hechos metropolitanos, que el informe no enumera.",
        "figs": [
          "P7-C23"
        ],
        "texts": {
          "t1": "Preliminar (prediagnóstico)",
          "t2": "Con matiz",
          "t3": "El informe no los enumera"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según un dato del Área Metropolitana que cita la fase preliminar del estudio, entre 1995 y 2019 se declararon 20 hechos metropolitanos: asuntos que afectan a dos o más municipios a la vez."
          },
          {
            "voice": "lucia",
            "text": "¿Y cuáles son esos hechos?"
          },
          {
            "voice": "narrador",
            "text": "El informe cita el registro del Área Metropolitana, pero no los enumera."
          }
        ],
        "ficcion": true
      },
      {
        "id": "tres-hechos",
        "type": "figure",
        "min": 13,
        "seVe": "Tres tarjetas —recurso hídrico, riesgo y conectividad ecológica— son los hechos metropolitanos con incidencia directa en la propuesta del estudio.",
        "figs": [
          "P7-C24"
        ],
        "texts": {
          "t1": "Recurso hídrico",
          "t2": "Riesgo",
          "t3": "Conectividad ecológica metropolitana",
          "t4": "El informe no dice si están entre los declarados",
          "t5": "¿CÓMO PENSÓ EL ESTUDIO EL FUTURO?"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Aparte de ese registro, el estudio identifica tres hechos metropolitanos con incidencia directa en su propuesta: el agua, los riesgos y la conectividad ecológica."
          },
          {
            "voice": "narrador",
            "text": "El informe no dice si coinciden con los declarados."
          },
          {
            "voice": "narrador",
            "text": "¿Y cómo pensó el estudio el futuro?"
          }
        ]
      },
      {
        "id": "ruta",
        "type": "figure",
        "min": 15,
        "seVe": "Una ruta de ocho pasos lleva a la apuesta 2040, y en el paso de priorización 16 expertos califican 18 factores de cambio con apoyo de herramientas de inteligencia artificial.",
        "figs": [
          "P7-C02",
          "P7-C04",
          "P7-C01"
        ],
        "texts": {
          "t1": "Delimitación",
          "t2": "Diagnóstico",
          "t3": "Factores de cambio",
          "t4": "Variables",
          "t5": "Priorización",
          "t6": "Análisis estructural",
          "t7": "Escenarios",
          "t8": "Apuesta 2040",
          "t9": "Ejercicio de expertos, no consulta ciudadana"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Para pensar Medellín a 2040, el estudio siguió una ruta de ocho momentos."
          },
          {
            "voice": "narrador",
            "text": "Un panel de 16 expertos priorizó 18 factores de cambio: fenómenos de hoy cuyo rumbo es incierto y que pueden transformar el territorio."
          },
          {
            "voice": "narrador",
            "text": "Es un ejercicio de expertos apoyado en herramientas de inteligencia artificial, no una consulta ciudadana."
          }
        ]
      },
      {
        "id": "motores",
        "type": "explain",
        "min": 13,
        "seVe": "Dos bloques —ocupación y uso del suelo, y adaptación al cambio climático— aparecen como los motores del sistema, junto a una tarjeta de puntajes sin cifras.",
        "figs": [],
        "texts": {
          "t1": "Ocupación y uso del suelo",
          "t2": "Adaptación al cambio climático",
          "t3": "Puntajes de la priorización",
          "t4": "Sin puntajes: código de colores contradictorio",
          "t5": "Esquema"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, el panel concluyó que los dos motores del sistema son la forma en que se ocupa y usa el suelo y la adaptación al cambio climático."
          },
          {
            "voice": "narrador",
            "text": "Los puntajes de esa priorización no se citan aquí, porque el documento describe su código de colores de forma contradictoria."
          }
        ]
      },
      {
        "id": "subsistemas",
        "type": "figure",
        "min": 15,
        "seVe": "Cinco bloques muestran los subsistemas; la estructura ecológica y el bloque de agua, riesgo y adaptación climática pasan al centro de la apuesta del estudio.",
        "figs": [
          "P7-C15"
        ],
        "texts": {
          "t1": "Estructura ecológica funcional y conectividad",
          "t2": "Agua, riesgo y adaptación climática",
          "t3": "Gobernanza ciudad-región",
          "t4": "Sistema alimentario y suelo rural",
          "t5": "Equilibrio económico regional",
          "t6": "Núcleo",
          "t7": "APUESTA DEL ESTUDIO: REORIENTAR LA OCUPACIÓN EN TORNO A LA ESTRUCTURA ECOLÓGICA Y EL RIESGO"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Los factores se agrupan en cinco subsistemas: estructura ecológica, agua y riesgo, gobernanza ciudad-región, sistema alimentario y economía regional."
          },
          {
            "voice": "narrador",
            "text": "La apuesta del estudio es reorientar la ocupación en torno a la estructura ecológica principal y la gestión del riesgo, orientada por el agua y con una gobernanza territorial."
          }
        ]
      },
      {
        "id": "anticipatoria",
        "type": "explain",
        "min": 12,
        "seVe": "Datos y monitoreo, junto al conocimiento de las comunidades, se unen para actuar antes de que los problemas se consoliden.",
        "figs": [],
        "texts": {
          "t1": "Antes de que el problema se consolide",
          "t2": "Datos y monitoreo",
          "t3": "Conocimiento de las comunidades",
          "t4": "Gobernanza anticipatoria"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Gobernanza anticipatoria significa actuar antes de que los problemas se consoliden."
          },
          {
            "voice": "narrador",
            "text": "Para lograrlo, el estudio propone combinar datos, monitoreo y el conocimiento de las comunidades."
          }
        ]
      },
      {
        "id": "agua-region",
        "type": "figure",
        "min": 13,
        "seVe": "Una tarjeta indica que cerca del 92 % del caudal concesionado viene de cuencas externas, y otra tarjeta recuerda que el comité de coordinación es una recomendación.",
        "figs": [
          "P7-C28"
        ],
        "texts": {
          "t1": "Comité de integración territorial o esquema asociativo · recomendación"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Según el estudio, con datos de EPM, cerca del 92 % del caudal concesionado a los embalses que abastecen a Medellín viene de cuencas externas al Distrito."
          },
          {
            "voice": "narrador",
            "text": "Por eso el estudio recomienda un comité de integración territorial o un esquema asociativo con la región; es una recomendación, aún no adoptada."
          }
        ]
      },
      {
        "id": "articulacion",
        "type": "figure",
        "min": 14,
        "seVe": "Una tarjeta indica seis espacios de articulación entre febrero y abril de 2026; al lado, representantes de entidades públicas y universidades en una mesa con tres sillas vacías.",
        "figs": [
          "P7-C33"
        ],
        "texts": {
          "t1": "Entidades públicas y universidades",
          "t2": "Más voces",
          "t3": "COORDINARSE EXIGE MÁS VOCES Y ACUERDOS"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Entre febrero y abril de 2026 hubo seis espacios de articulación entre entidades públicas y universidades."
          },
          {
            "voice": "hernan",
            "text": "¿Y la gente de los barrios y las veredas participó?"
          },
          {
            "voice": "narrador",
            "text": "El estudio reconoce que la voz de comunidades, organizaciones sociales y gremios fue limitada y que debe ampliarse."
          },
          {
            "voice": "narrador",
            "text": "En breve: coordinarse exige más voces y acuerdos con la región."
          }
        ]
      },
      {
        "id": "asuntos",
        "type": "figure",
        "min": 15,
        "seVe": "Nueve tarjetas resumen los asuntos estratégicos del estudio; la última, gobernanza multiescalar, queda destacada con las entidades cuya participación conjunta se requiere.",
        "figs": [
          "P7-C34"
        ],
        "texts": {
          "t1": "Estructura ecológica rezagada y medida por superficie",
          "t2": "El agua como sistema ordenador",
          "t3": "Riesgo sobre suelo ya ocupado",
          "t4": "Frente de urbanización desplazado hacia los bordes",
          "t5": "Brecha entre la norma rural y el uso real",
          "t6": "Dependencia metabólica regional",
          "t7": "Densificación condicionada al soporte",
          "t8": "El corredor del río como eje ecológico incompleto",
          "t9": "Gobernanza multiescalar",
          "t10": "Área Metropolitana",
          "t11": "Corantioquia",
          "t12": "Comisión Conjunta del POMCA",
          "t13": "Gobernación",
          "t14": "Municipios vecinos"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "El estudio dejó nueve asuntos estratégicos para la revisión del Plan de Ordenamiento Territorial, el POT."
          },
          {
            "voice": "narrador",
            "text": "Uno de ellos señala que lo que supera la competencia del Distrito requiere la participación conjunta del Área Metropolitana, Corantioquia, la Comisión Conjunta del POMCA, la Gobernación y los municipios vecinos."
          },
          {
            "voice": "narrador",
            "text": "El POMCA es el plan de ordenación y manejo de una cuenca hidrográfica."
          }
        ]
      },
      {
        "id": "cierre",
        "type": "recap",
        "min": 11,
        "seVe": "Lucía, Hernán y otros asistentes en la loma, con la frase final: la gobernanza regional no es un componente institucional que se agrega al final.",
        "figs": [],
        "texts": {
          "t1": "LA GOBERNANZA REGIONAL NO ES UN COMPONENTE INSTITUCIONAL QUE SE AGREGA AL FINAL"
        },
        "lines": [
          {
            "voice": "narrador",
            "text": "Como dice el estudio, la gobernanza regional no es un componente institucional que se agrega al final."
          },
          {
            "voice": "narrador",
            "text": "Estos resultados son insumos técnicos para la revisión del POT; las decisiones corresponden al Distrito."
          }
        ]
      }
    ],
    "checkpoints": [
      {
        "after": "subsistemas",
        "question": "La priorización de los 18 factores de cambio fue…",
        "options": [
          "Una consulta ciudadana abierta",
          "Un ejercicio de 16 expertos apoyado en herramientas de inteligencia artificial",
          "Una decisión adoptada en el POT"
        ],
        "answer": 1,
        "explain": "El documento la presenta como un ejercicio de expertos con apoyo de inteligencia artificial; sus resultados son insumos técnicos.",
        "hint": "La clave está en quiénes calificaron los factores."
      }
    ],
    "pauses": []
  }
];
