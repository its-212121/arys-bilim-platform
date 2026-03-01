import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import logo from "../assets/school-logo.jpg";

type SeriesKey = "SAT" | "IELTS" | "UNT";

function useInViewOnce(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { ref, visible } = useInViewOnce(0.12);

  return (
    <section id={id} className="py-10 md:py-14">
      <div
        ref={ref}
        className={[
          "rounded-2xl border bg-white/70 backdrop-blur shadow-sm",
          "p-5 md:p-8",
          "transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        ].join(" ")}
      >
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">{title}</h2>
          {subtitle ? (
            <p className="text-sm md:text-base text-slate-500 mt-1">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function MiniKpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-900 mt-1">{value}</div>
      {hint ? <div className="text-xs text-slate-500 mt-1">{hint}</div> : null}
    </div>
  );
}

function SimpleLineChart({
  series,
  height = 220,
}: {
  series: { label: string; value: number }[];
  height?: number;
}) {
  const width = 820;
  const padding = 36;

  const values = series.map((s) => s.value);
  const maxV = Math.max(...values, 1);
  const minV = Math.min(...values, 0);

  const scaleX = (i: number) =>
    padding + (i * (width - padding * 2)) / Math.max(series.length - 1, 1);

  const scaleY = (v: number) => {
    const range = maxV - minV || 1;
    const t = (v - minV) / range;
    return padding + (1 - t) * (height - padding * 2);
  };

  const points = series.map((s, i) => `${scaleX(i)},${scaleY(s.value)}`).join(" ");
  const area = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgba(15,23,42,0.15)"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="rgba(15,23,42,0.15)"
        />

        <polygon points={area} fill="rgba(37, 99, 235, 0.10)" />

        <polyline
          points={points}
          fill="none"
          stroke="rgba(37, 99, 235, 0.95)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {series.map((s, i) => (
          <g key={s.label}>
            <circle
              cx={scaleX(i)}
              cy={scaleY(s.value)}
              r="5"
              fill="white"
              stroke="rgba(37, 99, 235, 0.95)"
              strokeWidth="3"
            />
            <text
              x={scaleX(i)}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="rgba(15,23,42,0.65)"
            >
              {s.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function WorldMapLite({
  highlights,
}: {
  highlights: { country: string; city?: string; uni?: string }[];
}) {
  const pins = useMemo(() => {
    const base: Record<string, { x: number; y: number }> = {
      USA: { x: 180, y: 130 },
      UK: { x: 395, y: 110 },
      Germany: { x: 425, y: 120 },
      Turkey: { x: 475, y: 160 },
      Kazakhstan: { x: 540, y: 140 },
      Korea: { x: 650, y: 150 },
      Japan: { x: 690, y: 145 },
      China: { x: 610, y: 155 },
      UAE: { x: 520, y: 185 },
      Canada: { x: 190, y: 95 },
    };

    return highlights
      .map((h) => ({ ...h, pos: base[h.country] }))
      .filter((h) => h.pos);
  }, [highlights]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 p-4 overflow-hidden">
        <div className="text-sm text-white/70 mb-3">World destinations (demo map)</div>

        <svg viewBox="0 0 860 360" className="w-full h-auto">
          <defs>
            <radialGradient id="g1" cx="30%" cy="25%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.45)" />
              <stop offset="70%" stopColor="rgba(59,130,246,0.10)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="860" height="360" fill="transparent" />
          <ellipse cx="260" cy="120" rx="240" ry="160" fill="rgba(255,255,255,0.06)" />
          <ellipse cx="630" cy="160" rx="260" ry="170" fill="rgba(255,255,255,0.05)" />
          <ellipse cx="420" cy="150" rx="380" ry="230" fill="url(#g1)" />

          {pins.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.pos!.x} cy={p.pos!.y} r="7" fill="rgba(59,130,246,1)" />
              <circle cx={p.pos!.x} cy={p.pos!.y} r="14" fill="rgba(59,130,246,0.18)" />
            </g>
          ))}
        </svg>

        <div className="text-xs text-white/60 mt-2">
          Это лёгкая карта-заглушка. Потом заменим на настоящую интерактивную (с реальными странами).
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm font-semibold text-slate-900 mb-3">Where graduates go (пример)</div>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2">
              <div>
                <div className="text-sm font-semibold text-slate-900">{h.country}</div>
                <div className="text-xs text-slate-500">
                  {h.city ? h.city : "City —"} · {h.uni ? h.uni : "University —"}
                </div>
              </div>
              <div className="text-xs text-slate-500">2025–2026</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrgTreeDemo() {
  const directors = {
    name: "ТҰРСЫНАЛИЕВ ЖАНДОС АМАЛБЕКОВИЧ",
    role: "Директор",
  };

  const deputies = [
    { name: "A. Nurzhan", role: "Завуч · Academic" },
    { name: "S. Aigerim", role: "Завуч · Discipline" },
    { name: "D. Arman", role: "Завуч · Curriculum" },
    { name: "M. Ainur", role: "Завуч · Students" },
  ];

  const teachers = [
    "N. Bakyt (Math)",
    "A. Daniyar (IT)",
    "K. Aidana (English)",
    "B. Nursultan (Physics)",
    "S. Asem (Chemistry)",
    "M. Alua (Biology)",
    "T. Sultan (History)",
    "Z. Madina (Kazakh)",
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-white p-4">
        <div className="text-xs text-slate-500">Top</div>
        <div className="text-lg font-bold text-slate-900">{directors.name}</div>
        <div className="text-sm text-slate-600">{directors.role}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {deputies.map((d) => (
          <div key={d.name} className="rounded-xl border bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">{d.name}</div>
            <div className="text-xs text-slate-500 mt-1">{d.role}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm font-semibold text-slate-900 mb-2">Teachers (demo)</div>
        <div className="flex flex-wrap gap-2">
          {teachers.map((t) => (
            <span
              key={t}
              className="text-xs rounded-full border px-3 py-1 bg-slate-50 text-slate-700"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-3">
          Потом заменим на реальных учителей/отделы и сделаем “ветки” глубже.
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState<SeriesKey>("SAT");

  const seriesByTab: Record<SeriesKey, { label: string; value: number }[]> = useMemo(
    () => ({
      SAT: [
        { label: "2022", value: 0 },
        { label: "2023", value: 4 },
        { label: "2024", value: 9 },
        { label: "2025", value: 18 },
        { label: "2026", value: 26 },
      ],
      IELTS: [
        { label: "2022", value: 0 },
        { label: "2023", value: 6 },
        { label: "2024", value: 14 },
        { label: "2025", value: 22 },
        { label: "2026", value: 30 },
      ],
      UNT: [
        { label: "2022", value: 0 },
        { label: "2023", value: 10 },
        { label: "2024", value: 19 },
        { label: "2025", value: 35 },
        { label: "2026", value: 46 },
      ],
    }),
    []
  );

  const destinations = useMemo(
    () => [
      { country: "USA", city: "—", uni: "—" },
      { country: "UK", city: "—", uni: "—" },
      { country: "Korea", city: "Seoul", uni: "—" },
      { country: "Kazakhstan", city: "—", uni: "—" },
      { country: "Turkey", city: "—", uni: "—" },
      { country: "Germany", city: "—", uni: "—" },
      { country: "Japan", city: "—", uni: "—" },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-10 text-white shadow-sm">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-indigo-500 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start gap-7">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/10 border border-white/15 overflow-hidden flex items-center justify-center">
              <img
                src={logo}
                alt="School logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="text-xs text-white/70 px-2 text-center">(logo)</span>
            </div>

            <div>
              <div className="text-xs tracking-widest text-white/60">ARYS BILIM PLATFORM</div>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-1">Arys Bilim Innovation School</h1>
              <p className="text-sm md:text-base text-white/70 mt-2 max-w-2xl">
                Бұл бөлім — логиннен кейінгі негізгі экран. Төменге қарай скролл жасап, мектеп туралы негізгі блоктарды көресіз.
              </p>
            </div>
          </div>

          <div className="ml-auto grid grid-cols-2 md:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="rounded-xl border border-white/15 bg-white/10 p-3">
              <div className="text-xs text-white/60">Opened</div>
              <div className="text-lg font-bold">2022</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-3">
              <div className="text-xs text-white/60">First graduates</div>
              <div className="text-lg font-bold">2025</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-3 col-span-2 md:col-span-1">
              <div className="text-xs text-white/60">Focus</div>
              <div className="text-lg font-bold">STEM + Growth</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-6xl mx-auto px-4 pb-16">
        <Section id="intro" title="1) Мектеп логотипі + қысқа мәтін" subtitle="Kazakh intro text">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            <div className="lg:col-span-2">
              <p className="text-slate-700 leading-relaxed">
                Arys Bilim Innovation School — оқушының білімін ғана емес, ойлау жүйесін, тәртібін және мақсатқа жету қабілетін дамытатын орта.
                Біз заманауи STEM бағыттарын, тіл дағдыларын және жеке траекториямен оқытуды біріктіреміз.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniKpi label="Бағыт" value="STEM" hint="IT · Math · Science" />
                <MiniKpi label="Тіл" value="EN/KZ" hint="IELTS / Academic English" />
                <MiniKpi label="Мақсат" value="Growth" hint="тәртіп + нәтиже" />
              </div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Quick links (скролл)</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {[
                  ["#history1", "Тарих"],
                  ["#history2", "Инфрақұрылым"],
                  ["#org", "Құрылым"],
                  ["#stats", "График"],
                  ["#map", "Карта"],
                  ["#contacts", "Байланыс"],
                ].map(([href, label]) => (
                  <a key={href} href={href} className="rounded-lg border bg-white px-3 py-2 hover:bg-slate-50 transition">
                    {label}
                  </a>
                ))}
              </div>
              <div className="text-xs text-slate-500 mt-3">
                Бұл бөлімдер сол жақ менюге кірмейді — тек осы Home экранда скролл арқылы.
              </div>
            </div>
          </div>
        </Section>

        <Section id="history1" title="2) Мектеп тарихы (1-бөлім)" subtitle="Берілген фактілермен, ал нақты сандарды кейін толтырамыз">
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              Мектеп <b>2022</b> жылы ашылды. Алғашқы жылдары мектепте негізінен <b>7–8 сынып</b> оқушылары болды.
              Директор: <b>ТҰРСЫНАЛИЕВ ЖАНДОС АМАЛБЕКОВИЧ</b>.
            </p>
            <p>
              4 жыл ішінде мектеп өз жүйесін қалыптастырып, <b>2025</b> жылы алғашқы түлектерін шығарды.
              Академиялық нәтиже бойынша мектеп жоғары көрсеткіштерге жетіп, білім сапасын тұрақты түрде көтеріп келеді.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <MiniKpi label="Площадь" value="(to fill)" hint="мысалы: ___ м²" />
              <MiniKpi label="Кабинеттер" value="(to fill)" hint="мысалы: ___ кабинет" />
              <MiniKpi label="Жатақхана/Асхана" value="(to fill)" hint="толық ақпарат кейін" />
            </div>

            <div className="text-xs text-slate-500">
              Сен нақты ақпарат (площадь, кабинет саны, жатақхана, асхана, т.б.) жіберсең — мен бірден әдемілеп кірістіріп берем.
            </div>
          </div>
        </Section>

        <Section id="history2" title="3) Тарих (2-бөлім): инфрақұрылым" subtitle="спорт, алаң, акт залы — мәтін кейін нақтылап өңдейміз">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                Мектептің инфрақұрылымы оқушының күнделікті өмірін толық қолдайды: оқу кабинеттері, зертханалар,
                қауіпсіз орта және түрлі үйірмелерге арналған кеңістіктер.
              </p>
              <p>
                Сонымен қатар спорт зал, алаң және акт залы сияқты негізгі нысандар мектеп өмірін белсенді етеді:
                жарыстар, форумдар, концерттер және мектепішілік іс-шаралар.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { t: "Спорт зал", d: "Жаттығу, ойындар, жарыстар" },
                { t: "Футбол/спорт алаңы", d: "Ашық ауадағы белсенділік" },
                { t: "Акт залы", d: "Шаралар, жиналыстар, концерттер" },
                { t: "Асхана", d: "Оқушыларға арналған тағам" },
              ].map((x) => (
                <div key={x.t} className="rounded-xl border bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">{x.t}</div>
                  <div className="text-xs text-slate-500 mt-1">{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="org" title="4) Мектеп құрылымы (дерево)" subtitle="Қазір demo. Кейін нақты адамдарды енгіземіз">
          <OrgTreeDemo />
        </Section>

        <Section id="stats" title="5) Түлектер статистикасы (SAT / IELTS / UNT)" subtitle="Кнопкалармен ауысады — кейін нақты деректермен толтырамыз">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {(["SAT", "IELTS", "UNT"] as SeriesKey[]).map((k) => {
                const active = tab === k;
                return (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={[
                      "px-4 py-2 rounded-lg border font-semibold transition",
                      active ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50",
                    ].join(" ")}
                    type="button"
                  >
                    {k}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-sm text-slate-500 mb-3">Graduates progress · {tab}</div>
              <SimpleLineChart series={seriesByTab[tab]} />
              <div className="text-xs text-slate-500 mt-3">
                Деректер demo. Сен нақты сандарды берсең — графикті 1:1 нақтылап жасаймын.
              </div>
            </div>
          </div>
        </Section>

        <Section id="map" title="6) Әлем картасы: түлектер қайда түсті" subtitle="Қазір lite карта-заглушка + тізім. Кейін интерактив жасаймыз">
          <WorldMapLite highlights={destinations} />
        </Section>

        <Section id="contacts" title="7) Біз туралы / Байланыс" subtitle="Контактілерді кейін сен жібересің — қазір placeholder">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs text-slate-500">Instagram</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">@to_fill</div>
              <div className="text-xs text-slate-500 mt-2">Сен сілтемені жібергенде қосамыз.</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs text-slate-500">Phone</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">+7 ___ ___ __ __</div>
              <div className="text-xs text-slate-500 mt-2">Кейін нақты номер.</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs text-slate-500">Address</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">Arys / Shymkent</div>
              <div className="text-xs text-slate-500 mt-2">Нақты адрес кейін.</div>
            </div>
          </div>
        </Section>

        <div className="text-center text-xs text-slate-400 pt-8">Arys Bilim Platform · Home page (demo)</div>
      </div>
    </div>
  );
}
