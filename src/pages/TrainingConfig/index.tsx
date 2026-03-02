import { useState } from "react";

import { ConsoleCommand } from "@/components/ConsoleCommand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  godMode: boolean;
  showImpacts: boolean;
  pipeReview: boolean;
  clearGrenadesKey: string;
  botPlaceKey: string;
  rethrowKey: string;
}

const defaultConfig: TrainingConfig = {
  infiniteAmmo: true,
  trailTime: 5,
  godMode: true,
  showImpacts: true,
  pipeReview: true,
  clearGrenadesKey: "k",
  botPlaceKey: "j",
  rethrowKey: "r",
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

  const [selectedKnifeId, setSelectedKnifeId] = useState(500);

  const buildMainCommand = (): string => {
    const parts: string[] = [];

    // Базовые настройки (всегда)
    parts.push(
      "sv_cheats 1;",
      "bot_kick;",
      "mp_freezetime 0;",
      "mp_buy_anywhere 1;",
      "mp_maxmoney 999999;",
      "mp_warmup_pausetimer 1;",
      "mp_autoteambalance 0;",
      "mp_limitteams 0;",
      "ammo_grenade_limit_total 6;",
    );

    // Отступ перед изменяемыми настройками
    parts.push("\n");

    // Всегда присутствующие команды с переключением 0/1
    parts.push(`sv_infinite_ammo ${config.infiniteAmmo ? "1" : "0"};`);
    parts.push(`sv_showimpacts ${config.showImpacts ? "1" : "0"};`);
    parts.push(`sv_grenade_trajectory_prac_pipreview ${config.pipeReview ? "1" : "0"};`);

    // Траектория (всегда)
    parts.push(`sv_grenade_trajectory_prac_trailtime ${config.trailTime};`);


    // Неуязвимость — отдельно (только если включено)
    if (config.godMode) {
      parts.push(
        "buddha 1;",
        "buddha_ignore_bots 1;",
        "sv_regeneration_force_on 1;",
      );
    }

    // Отступ перед рестартом
    parts.push("\n");

    // Всегда в самом конце
    parts.push("mp_restartgame 1");

    // Собираем в одну строку
    return parts.join("");
  };

  const mainCommand = buildMainCommand();

  const clearGrenadesCommand = `bind ${config.clearGrenadesKey} "ent_fire smokegrenade_projectile kill;ent_fire molotov_projectile kill;ent_fire flashbang_projectile kill;ent_fire hegrenade_projectile kill;ent_fire decoy_projectile kill;"`;
  const botPlaceCommand = `bind ${config.botPlaceKey} "bot_stop 1; bot_add ; bot_place ; "`;
  const rethrowCommand = `bind ${config.rethrowKey} sv_rethrow_last_grenade`;

  const selectedKnife = knives.find((k) => k.id === selectedKnifeId)!;
  const knifeCommand = `subclass_create ${selectedKnife.id}`;

  return (
    <div className="mx-auto max-w-5xl space-y-10 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Настройка карты и конфигов для тренировок CS2
        </h1>
        <p className="text-zinc-400">
          Все настройки сохраняются автоматически в localStorage. Просто
          вставляйте команды в консоль игры.
        </p>
      </div>

      {/* Основная команда */}
      <Card>
        <CardHeader>
          <CardTitle>Основная команда</CardTitle>
          <CardDescription>
            Настройте параметры ниже — команда генерируется автоматически
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Настройки */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Label htmlFor="infiniteAmmo" className="text-base">
                Бесконечные патроны и гранаты
              </Label>
              <Switch
                id="infiniteAmmo"
                checked={config.infiniteAmmo}
                onCheckedChange={(v) =>
                  setConfig((prev) => ({ ...prev, infiniteAmmo: v }))
                }
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <Label htmlFor="slider">Время траектории гранат</Label>
                <span className="font-mono text-emerald-400">
                  {config.trailTime}
                </span>
              </div>
              <Slider
                id="slider"
                value={[config.trailTime]}
                onValueChange={([val]) =>
                  setConfig((prev) => ({ ...prev, trailTime: val }))
                }
                min={0}
                max={10}
                step={1}
              />
            </div>

              <div className="flex items-center justify-between">
              <Label htmlFor="pipeReview" className="text-base">
                Предпросмотр траектории гранат
              </Label>
              <Switch
                id="pipeReview"
                checked={config.pipeReview}
                onCheckedChange={(v) =>
                  setConfig((prev) => ({ ...prev, pipeReview: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showImpacts" className="text-base">
                Показывать попадания
              </Label>
              <Switch
                id="showImpacts"
                checked={config.showImpacts}
                onCheckedChange={(v) =>
                  setConfig((prev) => ({ ...prev, showImpacts: v }))
                }
              />
            </div>

          

            {/* Отдельный блок для неуязвимости */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <Label htmlFor="godMode" className="text-base font-semibold">
                  Неуязвимость (buddha + регенерация)
                </Label>
                <Switch
                  id="godMode"
                  checked={config.godMode}
                  onCheckedChange={(v) =>
                    setConfig((prev) => ({ ...prev, godMode: v }))
                  }
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Отдельная группа команд — не мешается с остальными настройками
              </p>
            </div>
          </div>

          {/* Сгенерированная команда */}
          <ConsoleCommand
            text={mainCommand}
            splitOnSemicolon={true}
          />
        </CardContent>
      </Card>

      {/* Бинды */}
      <Card>
        <CardHeader>
          <CardTitle>Полезные бинды</CardTitle>
          <CardDescription>Выберите удобные клавиши</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <Label>Клавиша очистки гранат</Label>
              <Input
                value={config.clearGrenadesKey}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    clearGrenadesKey: e.target.value.toLowerCase().slice(0, 1) || "k",
                  }))
                }
                maxLength={1}
                className="font-mono uppercase"
              />
              <ConsoleCommand text={clearGrenadesCommand} />
            </div>

            <div className="space-y-3">
              <Label>Клавиша добавления/размещения бота</Label>
              <Input
                value={config.botPlaceKey}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    botPlaceKey: e.target.value.toLowerCase().slice(0, 1) || "j",
                  }))
                }
                maxLength={1}
                className="font-mono uppercase"
              />
              <ConsoleCommand text={botPlaceCommand} />
            </div>

            <div className="space-y-3">
              <Label>Клавиша перебрасывания гранаты</Label>
              <Input
                value={config.rethrowKey}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    rethrowKey: e.target.value.toLowerCase().slice(0, 1) || "r",
                  }))
                }
                maxLength={1}
                className="font-mono uppercase"
              />
              <ConsoleCommand text={rethrowCommand} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ножи */}
      <Card>
        <CardHeader>
          <CardTitle>Ножи</CardTitle>
          <CardDescription>
            Сначала включите дроп ножей, потом выберите нужный
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ConsoleCommand
            text="mp_drop_knife_enable 1"
            label="Включение дропа ножей"
          />

          <div className="space-y-3">
            <Label>Создать нож</Label>
            <Select
              value={selectedKnifeId.toString()}
              onValueChange={(val) => setSelectedKnifeId(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите нож" />
              </SelectTrigger>
              <SelectContent>
                {knives.map((knife) => (
                  <SelectItem key={knife.id} value={knife.id.toString()}>
                    {knife.name} (ID: {knife.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ConsoleCommand
              text={knifeCommand}
              label={`Команда для: ${selectedKnife.name}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}