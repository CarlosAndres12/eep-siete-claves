/* Correcciones (spec §4.6) para #/precauciones: «Usa» / «No uses» / «Por qué». La columna «No uses» cita formas
   erróneas a propósito y está exenta de spec §10.1. `codigos`: inconsistencias internas del documento (I01…I42). */
window.EEP.data.corrections = [
  {
    "tema": "Predios rurales",
    "usa": "«El 94,7 % de los 18.493 predios rurales tiene menos de 4 hectáreas.»",
    "noUses": [
      "«El 94,7 % de los predios rurales tiene menos de 1 hectárea.»"
    ],
    "porque": "El capítulo prospectivo describe la misma cifra con otro umbral; se usa la del diagnóstico.",
    "codigos": [
      "I01"
    ]
  },
  {
    "tema": "Agua",
    "usa": "«Cerca del 92 % del caudal concesionado a los tres embalses proviene de cuencas externas.»",
    "noUses": [
      "«El 92 % del agua que consume Medellín viene de fuera.»"
    ],
    "porque": "Caudal concesionado y agua consumida son medidas distintas.",
    "codigos": [
      "I02"
    ]
  },
  {
    "tema": "Amenaza alta",
    "usa": "«En amenaza alta por movimientos en masa: el 40,93 % del área urbanizada, según el mapa combinado, y el 37,23 % del Distrito, según la zonificación oficial», cada cifra con su base.",
    "noUses": [
      "«El 40,93 % del Distrito está en amenaza alta.»"
    ],
    "porque": "Bases y denominadores distintos; no se suman ni se comparan.",
    "codigos": [
      "I11"
    ]
  },
  {
    "tema": "Expansión urbana",
    "usa": "Una sola medición por pieza, con su método.",
    "noUses": [
      "«Medellín creció 3.491,58 hectáreas, y además 692,65 hectáreas de piso duro.»"
    ],
    "porque": "Son métricas que el propio documento declara no comparables.",
    "codigos": [
      "I07"
    ]
  },
  {
    "tema": "Tres de cada cuatro",
    "usa": "«Tres de cada cuatro hectáreas nuevas (74,34 %) quedaron en los corregimientos, que abarcan 27.524,42 de las 37.639,66 hectáreas del Distrito; respecto a su área, ganaron 9,43 %, y las comunas, 8,74 %.»",
    "noUses": [
      "«Los corregimientos crecieron mucho más que las comunas en proporción a su área.»"
    ],
    "porque": "Es la parte de la ganancia total, no una tasa respecto al área de cada territorio.",
    "codigos": [
      "I09"
    ],
    "ref": [
      "Tabla 15-1"
    ]
  },
  {
    "tema": "Crecer hacia adentro",
    "usa": "«La apuesta de crecer hacia adentro se cumplió de manera parcial.»",
    "noUses": [
      "«No crecimos hacia adentro.»"
    ],
    "porque": "El titular del mensaje 6 es más tajante que el cierre del estudio, que habla de cumplimiento parcial; la extracción pide usar la formulación del cierre.",
    "codigos": []
  },
  {
    "tema": "Estructura vigente",
    "usa": "«La estructura vigente, de 2014, abarca 22.956,09 hectáreas.»",
    "noUses": [
      "«La nueva estructura ecológica tendrá 22.956,09 hectáreas.»"
    ],
    "porque": "El documento no reporta el área total de la propuesta.",
    "codigos": [
      "I28"
    ]
  },
  {
    "tema": "Retiros",
    "usa": "«La propuesta incorporaría 1.358,25 hectáreas al elemento de ríos y quebradas.»",
    "noUses": [
      "«La mayor parte de las 1.358,25 hectáreas está en suelo urbano.»"
    ],
    "porque": "El documento no desagrega esas hectáreas por clase de suelo.",
    "codigos": [
      "I04"
    ]
  },
  {
    "tema": "Retiro de 30 m",
    "usa": "«Un mínimo de 30 m que, según el documento, fija la Sentencia T-529 de 2025; su adopción en el POT está pendiente.»",
    "noUses": [
      "«El POT ya exige un retiro de 30 m en toda la ciudad.»"
    ],
    "porque": "Estatus normativo pendiente; el capítulo prospectivo atribuye los 30 m a otra norma.",
    "codigos": [
      "I29"
    ]
  },
  {
    "tema": "Exactitud del mapa",
    "usa": "«La meta de exactitud fue del 85 %; el documento no reporta su verificación.»",
    "noUses": [
      "«El mapa de coberturas tiene una exactitud del 85 %.»"
    ],
    "porque": "Es un hito cuyo cumplimiento no se reporta.",
    "codigos": [
      "I18"
    ]
  },
  {
    "tema": "Conflicto de uso",
    "usa": "«10.534,68 hectáreas en conflicto de uso, en una primera estimación.»",
    "noUses": [
      "«10.534,68 hectáreas están ocupadas ilegalmente.»"
    ],
    "porque": "Conflicto no significa ilegalidad; el documento refiere la cifra a años distintos según el pasaje.",
    "codigos": [
      "I36"
    ]
  },
  {
    "tema": "Corredores",
    "usa": "«El estudio reporta que en los enlaces estructurantes disminuyó la proporción de bosques y áreas seminaturales.»",
    "noUses": [
      "«En una década, los bosques de los enlaces pasaron de 71,2 % a 48,6 %.»"
    ],
    "porque": "El texto y una figura del documento asignan esos valores a años distintos, y la serie mezcla capas de fuentes distintas.",
    "codigos": [
      "I42",
      "I08"
    ]
  },
  {
    "tema": "Conectividad metropolitana",
    "usa": "«La propuesta vincula 5.915,18 hectáreas de la estructura del plan metropolitano ubicadas en el Distrito.»",
    "noUses": [
      "«La estructura ecológica del Distrito crece 5.915,18 hectáreas.»"
    ],
    "porque": "Son áreas que se incorporan a un elemento de la propuesta, no un aumento neto establecido por el documento.",
    "codigos": []
  },
  {
    "tema": "Alimentos",
    "usa": "«Medellín produce una fracción mínima de los alimentos que demanda el valle.»",
    "noUses": [
      "«Medellín produce el 0,5 % de sus alimentos.»",
      "«Medellín no produce alimentos.»"
    ],
    "porque": "El documento no muestra el cálculo y usa medidas no equivalentes.",
    "codigos": [
      "I03"
    ]
  },
  {
    "tema": "Probabilidad",
    "usa": "«851 hectáreas del Distrito con alta probabilidad de cambio urbano entre 2014 y 2024.»",
    "noUses": [
      "«851 hectáreas urbanizadas.»"
    ],
    "porque": "Son probabilidades, no áreas urbanizadas confirmadas.",
    "codigos": []
  },
  {
    "tema": "Bordes",
    "usa": "«El 36,77 % del límite con Medellín tiene coberturas artificiales a ambos lados, incluidas las vías.»",
    "noUses": [
      "«Medellín ya forma una sola ciudad con sus vecinos.»"
    ],
    "porque": "Esa continuidad incluye la red vial y no equivale a una conurbación.",
    "codigos": []
  },
  {
    "tema": "Priorización",
    "usa": "«Un panel de 16 expertos, con apoyo de herramientas de inteligencia artificial, priorizó 18 factores de cambio.»",
    "noUses": [
      "«Los actores territoriales priorizaron unánimemente los factores.»"
    ],
    "porque": "Fue un ejercicio de expertos con disensos registrados; sus puntajes usan un código de colores contradictorio.",
    "codigos": [
      "I30"
    ]
  },
  {
    "tema": "Hechos metropolitanos",
    "usa": "«Según un dato del Área Metropolitana citado en el prediagnóstico del estudio, entre 1995 y 2019 se declararon 20 hechos metropolitanos; el informe no los enumera.»",
    "noUses": [
      "«Los tres hechos con incidencia directa son tres de los 20 declarados.»"
    ],
    "porque": "El informe no dice si coinciden.",
    "codigos": []
  },
  {
    "tema": "Lenguaje",
    "usa": "«Bordes de ladera», «ocupación», «territorios», «condiciones».",
    "noUses": [
      "Palabras como «invasión» o nombres de barrios señalados como zonas de riesgo."
    ],
    "porque": "Para no estigmatizar, se habla de territorios y condiciones, no de personas; el propio documento advierte que «no toda informalidad nace de la ilegalidad; buena parte nace de la necesidad».",
    "codigos": []
  }
];
