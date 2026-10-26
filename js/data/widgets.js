/* Widgets (spec §8): textos y claves. Los distractores citan lecturas erróneas a propósito (exentos de spec §10.1). */
window.EEP.data.widgets = {
  "queMide": {
    "title": "¿Qué mide esta cifra?",
    "question": "¿Qué mide esta cifra?",
    "next": "Siguiente",
    "progress": "Cifra {n} de {total}",
    "end": "Recorrido terminado. Cada tarjeta del banco tiene su fuente y su alcance.",
    "items": [
      {
        "figure": "P2-C47",
        "correct": "La proporción del caudal concesionado a los tres embalses que abastecen al Distrito que viene de cuencas fuera de su territorio",
        "distractors": [
          "La parte del agua que se consume en Medellín que viene de otros municipios",
          "La parte de la lluvia del valle que llega a los embalses"
        ],
        "explain": "El estudio la calcula con datos de EPM sobre el agua que la autoridad ambiental autoriza captar para los embalses; no es lo mismo que el agua que se consume.",
        "hint": "La clave está en la palabra «concesionado»."
      },
      {
        "figure": "P2-C09",
        "correct": "La parte del área urbanizada en amenaza alta por movimientos en masa, según el mapa combinado",
        "distractors": [
          "La parte de todo el Distrito en amenaza alta, según la zonificación oficial",
          "La parte de la población en riesgo alto"
        ],
        "explain": "Mide el área urbanizada con el mapa que combina dos estudios; la zonificación oficial da otra cifra, con otra base.",
        "hint": "La clave está en la superficie que se mide."
      },
      {
        "figure": "P4-C01",
        "correct": "El área de la estructura ecológica vigente, de 2014",
        "distractors": [
          "El área de la nueva estructura que propone el estudio",
          "El área de bosque del Distrito"
        ],
        "explain": "Es la estructura vigente; el documento no reporta el área total de la propuesta.",
        "hint": "La clave está en el año de la delimitación."
      },
      {
        "figure": "P1-C09",
        "correct": "Suelo rural cuyo uso actual no coincide con lo que permite la norma, en una primera estimación",
        "distractors": [
          "Suelo ocupado ilegalmente",
          "Bosque perdido en el suelo rural"
        ],
        "explain": "Un conflicto de uso es una diferencia entre el uso actual y la norma; no significa ilegalidad ni implica necesariamente daño ambiental.",
        "hint": "La clave está en lo que se compara en un conflicto de uso."
      },
      {
        "figure": "P3-C36",
        "correct": "Áreas con probabilidad alta y media de cambio urbano según señales satelitales",
        "distractors": [
          "Áreas urbanizadas confirmadas",
          "Áreas donde está prohibido construir"
        ],
        "explain": "Son probabilidades de cambio, no áreas urbanizadas confirmadas.",
        "hint": "La clave está en la palabra «probabilidad»."
      },
      {
        "figure": "P3-C05",
        "correct": "La parte de la ganancia total de tejido urbano que quedó en los corregimientos",
        "distractors": [
          "La parte del área de los corregimientos que se urbanizó",
          "La parte del crecimiento que fue ocupación informal"
        ],
        "explain": "Es una parte de lo ganado en todo el Distrito; respecto a su propia área, la ganancia de los corregimientos equivale al 9,43 % de su superficie.",
        "hint": "La clave está en el total del que se toma la parte."
      },
      {
        "figure": "P4-C21",
        "correct": "Área con capacidad media alta para el desplazamiento de aves, según un modelo",
        "distractors": [
          "Área de bosque del Distrito",
          "Área protegida por la norma"
        ],
        "explain": "Sale de un modelo para una especie patrón de ave.",
        "hint": "La clave está en la herramienta que produjo la cifra."
      },
      {
        "figure": "P1-C01",
        "correct": "La meta de exactitud que el estudio se fijó para el mapa de coberturas",
        "distractors": [
          "La exactitud medida del mapa de 2024",
          "El agua que llega al valle desde fuera"
        ],
        "explain": "Es una meta; el documento no reporta todavía su cumplimiento.",
        "hint": "Meta y medición no son lo mismo."
      },
      {
        "figure": "P3-C32",
        "correct": "La parte de la longitud del límite con Medellín que tiene coberturas artificiales a ambos lados, incluidas las vías",
        "distractors": [
          "La parte del límite donde ya hay una ciudad continua",
          "La parte de los municipios vecinos que está construida"
        ],
        "explain": "Esa continuidad incluye la red vial y no equivale a una ciudad continua.",
        "hint": "La clave está en lo que incluyen las coberturas artificiales."
      },
      {
        "figure": "P6-C58",
        "correct": "La proporción de los predios rurales que tiene menos de 4 hectáreas",
        "distractors": [
          "La proporción de los predios rurales que tiene menos de 1 hectárea",
          "La proporción de las familias campesinas sin tierra"
        ],
        "explain": "El estudio usa un umbral operativo de 4 hectáreas, menor que la Unidad Agrícola Familiar.",
        "hint": "La clave está en el umbral que usa el estudio."
      },
      {
        "figure": "P6-C70",
        "correct": "Viajes de carga de alimentos y productos agropecuarios dentro del Valle de Aburrá",
        "distractors": [
          "Toneladas de alimentos que llegan al valle",
          "Familias que compran en mercados campesinos"
        ],
        "explain": "El registro cuenta viajes de carga formal, no toneladas.",
        "hint": "La clave está en la unidad que cuenta el registro."
      },
      {
        "figure": "P7-C04",
        "correct": "El número de expertos del panel que priorizó los factores de cambio, con apoyo de inteligencia artificial",
        "distractors": [
          "El número de personas que respondieron una consulta ciudadana",
          "El número de integrantes de un comité ya adoptado"
        ],
        "explain": "Es un ejercicio de expertos, no una consulta ciudadana.",
        "hint": "La clave está en quiénes calificaron los factores."
      }
    ]
  },
  "escalas": {
    "title": "¿De qué escala habla?",
    "items": [
      "P1-C09",
      "P3-C23",
      "P2-C48",
      "P2-C50",
      "P3-C40",
      "P6-C42",
      "P7-C23",
      "P6-C80"
    ],
    "wrong": "Casi. Pista: la clave está en el territorio del que habla la cifra.",
    "end": "Las tres escalas están completas. Un detalle: de los tres embalses que abastecen a Medellín, Piedras Blancas es el único con aportes desde suelo del Distrito."
  },
  "retiros": {
    "title": "Retiros de ríos y quebradas",
    "scale": {
      "from": 0,
      "to": 30,
      "step": 5,
      "unit": "m"
    },
    "toggles": [
      {
        "id": "acuerdo",
        "label": "Acuerdo 48 de 2014: 10 o 15 m en determinadas zonas urbanas",
        "figure": "P2-C30",
        "bands": [
          10,
          15
        ]
      },
      {
        "id": "sentencia",
        "label": "Sentencia T-529 de 2025: mínimo de 30 m",
        "figure": "P2-C31",
        "bands": [
          30
        ]
      }
    ],
    "note": "La propuesta del estudio aplica el mínimo de 30 m e incorporaría {fig:P2-C28} al elemento de ríos y quebradas. Es una propuesta, no una norma adoptada, y su estatus normativo está pendiente.",
    "label": "Escala exacta de los retiros; cauce ilustrativo"
  }
};
