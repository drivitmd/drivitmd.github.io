# -*- coding: utf-8 -*-
"""Доводит «Контакты» и «Партнёрам» — две самые тонкие страницы сайта.

Что чинится:
  1. На «Контактах» пользователю видна заметка для разработчика про
     виджет SnapWidget — читается как недостроенный сайт.
  2. «Ответим за пару минут» противоречит «ответим в течение дня» на
     заявке и обещает то, чего никто не гарантирует.
  3. Три канала связи перечислены без подсказки, какой для чего.
  4. «Партнёрам» ведёт с продажи рекламных карточек — на сайте, у
     которого пока нет трафика, это неубедительно. Ведём с обмена
     аудиторией, платное размещение оставляем ниже.

Скрипт идемпотентен.
"""
import os
import re
import sys

PREVIEW = os.path.join(os.path.dirname(os.path.abspath(__file__)), "preview")

CHANNELS_RU = """<div class="offer" style="margin-top:34px">
    <h3>Какой канал для чего</h3>
    <dl>
      <div><dt>Хочу на ретрит или в игру</dt><dd>Пиши Кристине в WhatsApp или оставь <a href="zayavka.html">заявку</a> — так мы точно ничего не потеряем.</dd></div>
      <div><dt>Есть вопрос перед решением</dt><dd>Любой канал. На «а мне подойдёт?», «а если я расплачусь», «что взять с собой» отвечаем без давления и без продаж.</dd></div>
      <div><dt>Хочу просто посмотреть</dt><dd>Instagram. Там атмосфера, кадры и анонсы раньше, чем на сайте.</dd></div>
      <div><dt>Сотрудничество</dt><dd>Страница <a href="partneram.html">для партнёров</a> — там же форма.</dd></div>
    </dl>
    <p class="fine">Пишем и говорим по-русски и по-румынски. Отвечаем в течение дня, обычно быстрее. Если молчим дольше — значит, идёт ретрит или сессия, вернёмся сразу после.</p>
  </div>"""

CHANNELS_RO = """<div class="offer" style="margin-top:34px">
    <h3>Ce canal, pentru ce</h3>
    <dl>
      <div><dt>Vreau la retreat sau la joc</dt><dd>Scrie-i Cristinei pe WhatsApp sau lasă o <a href="zayavka.html">cerere</a> — așa sigur nu se pierde nimic.</dd></div>
      <div><dt>Am o întrebare înainte să decid</dt><dd>Orice canal. La „mi se potrivește?”, „și dacă plâng”, „ce iau cu mine” răspundem fără presiune și fără vânzare.</dd></div>
      <div><dt>Vreau doar să văd</dt><dd>Instagram. Acolo sunt atmosfera, cadrele și anunțurile mai devreme decât pe site.</dd></div>
      <div><dt>Colaborare</dt><dd>Pagina <a href="partneram.html">pentru parteneri</a> — acolo e și formularul.</dd></div>
    </dl>
    <p class="fine">Scriem și vorbim în rusă și în română. Răspundem în aceeași zi, de obicei mai repede. Dacă tăcem mai mult — înseamnă că e retreat sau ședință, revenim imediat după.</p>
  </div>"""

# «Партнёрам»: ведём с того, что реально работает на нашем этапе
PARTNERS_RU = """<div class="offer" style="margin-top:34px">
    <h3>С чего обычно начинаем</h3>
    <dl>
      <div><dt>Обмен аудиторией</dt><dd>Вы рассказываете о нас своим, мы о вас — своим. Без денег, честно в обе стороны. Так к нам приходят студии йоги, косметологи, коворкинги и частные психологи.</dd></div>
      <div><dt>Совместное событие</dt><dd>Женский круг в вашем пространстве, наша ведущая — ваша площадка и аудитория. Делим то, что получилось, пополам.</dd></div>
      <div><dt>Место для ретрита</dt><dd>Ищем дома и усадьбы в Молдове и Румынии: до пятнадцати человек, тишина, вода или горы рядом. Если у вас такое есть — напишите.</dd></div>
    </dl>
    <p class="fine">Платное размещение на сайте тоже возможно, но честно скажем: сайт молодой, и обмен аудиторией сейчас даёт обеим сторонам больше, чем баннер.</p>
  </div>"""

PARTNERS_RO = """<div class="offer" style="margin-top:34px">
    <h3>De unde începem de obicei</h3>
    <dl>
      <div><dt>Schimb de audiență</dt><dd>Voi le povestiți alor voștri despre noi, noi alor noștri despre voi. Fără bani, corect în ambele sensuri. Așa ajung la noi studiouri de yoga, cosmetologi, coworking-uri și psihologi.</dd></div>
      <div><dt>Eveniment comun</dt><dd>Un cerc de femei în spațiul vostru: gazda e a noastră, locul și audiența — ale voastre. Împărțim rezultatul pe din două.</dd></div>
      <div><dt>Loc pentru retreat</dt><dd>Căutăm case și conace în Moldova și România: până la cincisprezece persoane, liniște, apă sau munți aproape. Dacă aveți așa ceva — scrieți-ne.</dd></div>
    </dl>
    <p class="fine">Plasarea plătită pe site e și ea posibilă, dar spunem cinstit: site-ul e tânăr, iar schimbul de audiență dă acum ambelor părți mai mult decât un banner.</p>
  </div>"""

SUBS = {
    "kontakty.html": [
        # заметка для разработчика, видимая людям
        ("<h2>@drivit.md — живая лента</h2><p>Здесь будет автоматическая лента постов со страницы (виджет SnapWidget). Обновляется сама.</p>",
         "<h2>Самое живое — в Instagram</h2><p>Там кадры, анонсы и ответы на вопросы участниц — раньше, чем здесь.</p>"),
        ("ответим за пару минут", "ответим в течение дня"),
    ],
    "ro/kontakty.html": [
        ("<h2>@drivit.md — flux live</h2><p>Aici va fi fluxul automat de postări de pe pagină (widget SnapWidget). Se actualizează singur.</p>",
         "<h2>Cel mai viu — pe Instagram</h2><p>Acolo sunt cadrele, anunțurile și răspunsurile la întrebările participantelor — mai devreme decât aici.</p>"),
        ("răspundem în câteva minute", "răspundem în aceeași zi"),
    ],
}


def apply(rel, pairs):
    path = os.path.join(PREVIEW, rel.replace("/", os.sep))
    s = open(path, encoding="utf-8").read()
    n = 0
    for old, new in pairs:
        if old in s:
            s = s.replace(old, new); n += 1
        elif new not in s:
            print("   не найдено в %s: %s…" % (rel, old[:60]))
    open(path, "w", encoding="utf-8").write(s)
    return n


def insert_after_hero(rel, block, marker):
    """Вставляет блок сразу после первой секции страницы."""
    path = os.path.join(PREVIEW, rel.replace("/", os.sep))
    s = open(path, encoding="utf-8").read()
    if marker in s:
        return False
    m = re.search(r'<section><div class="wrap">', s)
    if not m:
        print("   якорь не найден в", rel); return False
    end = s.index("</div></section>", m.end())
    s = s[:end] + "\n  " + block + "\n" + s[end:]
    open(path, "w", encoding="utf-8").write(s)
    return True


if __name__ == "__main__":
    total = 0
    for rel, pairs in SUBS.items():
        total += apply(rel, pairs)
        print("%-20s заменено" % rel)
    for rel, block, marker in (
        ("kontakty.html", CHANNELS_RU, "Какой канал для чего"),
        ("ro/kontakty.html", CHANNELS_RO, "Ce canal, pentru ce"),
        ("partneram.html", PARTNERS_RU, "С чего обычно начинаем"),
        ("ro/partneram.html", PARTNERS_RO, "De unde începem de obicei"),
    ):
        ok = insert_after_hero(rel, block, marker)
        print("%-20s блок: %s" % (rel, "добавлен" if ok else "уже есть"))
    print("всего замен:", total)
