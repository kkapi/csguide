import { useMediaQuery } from "@uidotdev/usehooks";
import { useState } from "react";

import { ConsoleCommand } from "@/components/ConsoleCommand";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/utils/useLocalStorage";

interface TrainingConfig {
  infiniteAmmo: boolean;
  trailTime: number;
  showImpacts: boolean;
  pipeReview: boolean;
  godMode: boolean;
}

const defaultConfig: TrainingConfig = {
  infiniteAmmo: true,
  trailTime: 5,
  showImpacts: false,
  pipeReview: false,
  godMode: true,
};

const knives = [
  { id: 500, name: "Штык-нож" },
  { id: 503, name: "Классический нож" },
  { id: 505, name: "Складной нож" },
  { id: 506, name: "Нож с лезвием-крюком" },
  { id: 507, name: "Керамбит" },
  { id: 508, name: "Штык-нож М9" },
  { id: 509, name: "Охотничий нож" },
  { id: 512, name: "Фальшион" },
  { id: 514, name: "Нож Боуи" },
  { id: 515, name: "Нож-бабочка" },
  { id: 516, name: "Тычковые ножи" },
  { id: 517, name: "Паракорд-нож" },
  { id: 518, name: "Нож выживания" },
  { id: 519, name: "Медвежий нож" },
  { id: 520, name: "Наваха" },
  { id: 521, name: "Нож «Бродяга»" },
  { id: 522, name: "Стилет" },
  { id: 523, name: "Коготь" },
  { id: 525, name: "Скелетный нож" },
  { id: 526, name: "Кукри" },
] as const;

export function TrainingConfigs() {
  const [config, setConfig] = useLocalStorage<TrainingConfig>(
    "cs2-training-config",
    defaultConfig,
  );

  const [selectedKnifeId, setSelectedKnifeId] = useState(507);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const selectedKnifeName =
    knives.find((k) => k.id === selectedKnifeId)?.name ?? "—";

  const buildMainCommand = (): string => {
    const parts: string[] = [
      "sv_cheats 1;",
      "bot_kick;",
      "mp_freezetime 0;",
      "mp_buy_anywhere 1;",
      "mp_maxmoney 999999;",
      "mp_warmup_pausetimer 1;",
      "mp_autoteambalance 0;",
      "mp_limitteams 0;",
      "ammo_grenade_limit_total 6;",
      "\n",
      `sv_infinite_ammo ${config.infiniteAmmo ? "1" : "0"};`,
      `sv_grenade_trajectory_prac_trailtime ${config.trailTime};`,
      `sv_grenade_trajectory_prac_pipreview ${config.pipeReview ? "1" : "0"};`,
      `sv_showimpacts ${config.showImpacts ? "1" : "0"};`,
      "\n",
      "mp_restartgame 1;",
    ];
    return parts.join("");
  };

  const buildGodCommand = (): string => {
    const mode = config.godMode ? "1" : "0";
    return `buddha ${mode}; buddha_ignore_bots ${mode}; sv_regeneration_force_on ${mode};`;
  };

  const knifeCommand = `subclass_create ${selectedKnifeId};`;

  const fullKnifeCommand = [
    "sv_cheats 1",
    "mp_drop_knife_enable 1",
    knifeCommand,
  ].join("; ");

  return (
    <div className="flex flex-col gap-5 mx-2 md:mx-4">
      <h1 className="text-3xl font-bold tracking-tight">
        Настройка сервера для тренировки
      </h1>

      <div className="space-y-4 text-zinc-300">
        <div>
          <p>
            Чтобы включить консоль в CS2, откройте главное меню игры и нажмите
            на иконку шестерёнки в левом верхнем углу. Перейдите во вкладку
            «Игра», найдите параметр «Включить консоль разработчика (~)» и
            установите значение «Да».
          </p>
        </div>
        <div>
          <p>
            Чтобы запустить карту в режиме тренировки, перейдите в раздел
            «Играть» → «Тренировка» → «Соревновательный». Выберите нужную карту
            из списка и нажмите «Начать игру».
          </p>
        </div>

        <p className="text-sm text-zinc-500">
          Все настройки ниже сохраняются автоматически. Копируйте команды в
          консоль.
        </p>
      </div>

      {/* Основные настройки */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Основные настройки</h2>

        <div className="flex flex-col md:flex-row md:gap-10 text-zinc-400">
          <div className="md:w-1/2 space-y-6">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="infinite-ammo"
                className="text-base cursor-pointer select-none"
              >
                Бесконечные патроны и гранаты
              </Label>
              <Switch
                id="infinite-ammo"
                checked={config.infiniteAmmo}
                onCheckedChange={(v) =>
                  setConfig((prev) => ({ ...prev, infiniteAmmo: v }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="trail-time"
                  className="text-base cursor-pointer select-none"
                >
                  Время траектории гранат
                </Label>
                <span className="font-mono text-yellow-300/65 tabular-nums">
                  {config.trailTime} сек
                </span>
              </div>
              <Slider
                id="trail-time"
                value={[config.trailTime]}
                onValueChange={([v]) =>
                  setConfig((prev) => ({ ...prev, trailTime: v }))
                }
                min={0}
                max={10}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="pipe-review"
                className="text-base cursor-pointer select-none"
              >
                Предпросмотр траектории
              </Label>
              <Switch
                id="pipe-review"
                checked={config.pipeReview}
                onCheckedChange={(v) =>
                  setConfig((prev) => ({ ...prev, pipeReview: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="show-impacts"
                className="text-base cursor-pointer select-none"
              >
                Следы от пуль
              </Label>
              <Switch
                id="show-impacts"
                checked={config.showImpacts}
                onCheckedChange={(v) =>
                  setConfig((prev) => ({ ...prev, showImpacts: v }))
                }
              />
            </div>
          </div>

          <div className="md:w-1/2" />
        </div>

        <ConsoleCommand
          text={buildMainCommand()}
          splitOnSemicolon
          label="Настройки сервера для тренировок"
        />
      </section>

      {/* Здоровье */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Здоровье</h2>
        <div className="flex gap-4 items-center justify-between md:justify-start">
          <Label
            htmlFor="god-mode"
            className="cursor-pointer select-none text-md text-zinc-400"
          >
            Неуязвимость и восстановление хп
          </Label>
          <Switch
            id="god-mode"
            checked={config.godMode}
            onCheckedChange={(v) =>
              setConfig((prev) => ({ ...prev, godMode: v }))
            }
          />
        </div>

        <ConsoleCommand text={buildGodCommand()} />
      </section>

      {/* Полезные команды – вертикальный список */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">Полезные команды</h2>
        <div className="space-y-7">
          <div className="space-y-2">
            <div className="text-xl font-semibold text-zinc-200">1. Гранаты</div>
            <ConsoleCommand
              text={`sv_rethrow_last_grenade`}
              label="Повторить последний бросок гранаты"
            />
            <ConsoleCommand
              text={`ent_fire smokegrenade_projectile kill; ent_fire molotov_projectile kill; ent_fire flashbang_projectile kill; ent_fire hegrenade_projectile kill; ent_fire decoy_projectile kill;`}
              label="Очистить гранаты"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xl font-semibold text-zinc-200">2. Боты</div>
            <ConsoleCommand
              text={`bot_add; bot_stop 1;`}
              label="Добавить и остановить"
            />
            <ConsoleCommand
              text={`bot_place`}
              label="Поставить на место прицела"
            />
            <ConsoleCommand text={`bot_crouch 1`} label="Посадить бота" />
          </div>
          <div className="space-y-2">
            <div className="text-xl font-semibold text-zinc-200">3. Полет</div>
            <ConsoleCommand text={`noclip`} label="Включить / выключить" />
          </div>
        </div>

        {/* Как биндить */}
        <div className="mt-10 space-y-4">
          <h3 className="text-xl font-semibold">
            Как биндить команды на клавиши
          </h3>
          <ConsoleCommand
            text={`bind "клавиша" "команда"`}
            label="Шаблон бинда"
          />
          <div className="space-y-4 text-sm font-mono text-zinc-300 bg-zinc-900/40 p-4 rounded-md border border-zinc-800">
            <div>
              bind "\" "ent_fire smokegrenade_projectile kill; ent_fire
              molotov_projectile kill; ent_fire flashbang_projectile kill;
              ent_fire hegrenade_projectile kill; ent_fire decoy_projectile
              kill;"
            </div>
            <div>bind "p" "sv_rethrow_last_grenade"</div>
            <div>bind "+" "noclip"</div>
          </div>
        </div>
      </section>

      {/* Выбор ножа */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Выбор ножа</h2>

        <div className="space-y-6">
          {isDesktop ? (
            <RadioGroup
              value={selectedKnifeId.toString()}
              onValueChange={(v) => setSelectedKnifeId(Number(v))}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4"
            >
              {knives.map((knife) => (
                <div key={knife.id} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={knife.id.toString()}
                    id={`knife-${knife.id}`}
                  />
                  <Label
                    htmlFor={`knife-${knife.id}`}
                    className="cursor-pointer text-base leading-tight"
                  >
                    {knife.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Select
              value={selectedKnifeId.toString()}
              onValueChange={(v) => setSelectedKnifeId(Number(v))}
            >
              <SelectTrigger id="knife-select" className="w-full">
                <SelectValue placeholder="Выберите нож">
                  {selectedKnifeName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[55vh]">
                {knives.map((knife) => (
                  <SelectItem
                    key={knife.id}
                    value={knife.id.toString()}
                    className="py-2.5 text-base"
                  >
                    {knife.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <ConsoleCommand
            text={fullKnifeCommand}
            label={`ВЫДАТЬ ${selectedKnifeName.toUpperCase()}`}
          />
        </div>
      </section>
    </div>
  );
}
