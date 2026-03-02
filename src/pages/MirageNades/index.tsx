import { ConsoleCommand } from "@/components/ConsoleCommand";

export function MirageNades() {
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Гранаты Mirage</h1>

      {/* Информационное сообщение */}

      <p className="text-md my-5 text-zinc-400 leading-relaxed">
        Раздел в работе. Здесь будут карточки с гранатами, разные варианты
        отображения (сетка/список), поиск по названиям, фильтрация типам.
      </p>

      {/* Окно */}

      <h2 className="text-2xl font-semibold mb-4 text-white">Окно</h2>

      <div>
        <ConsoleCommand
          text="setpos 1422.968750 36.462585 -103.968750;setang -20.255405 163.439133 0.000000"
          label="Бежим в лево, когда прицел на краю красного LMB + JUMP THROW"
          splitOnSemicolon
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
        <ConsoleCommand
          text="setpos 1422.968750 -55.953369 -103.968750;setang -20.187376 -168.612518 0.000000"
          label="LMB + JUMP THROW"
          splitOnSemicolon
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
        <ConsoleCommand
          text="setpos 1296.000244 32.000065 -103.968750;setang -29.605461 -165.455627 0.000000"
          label="W + LMB + JUMP THROW (INST)"
          splitOnSemicolon
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
        <ConsoleCommand
          text="setpos 1216.000000 -16.000000 -99.968750;setang -44.390411 -166.586197 0.000000"
          label="W + LMB + JUMP THROW (INST)"
          splitOnSemicolon
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
        <ConsoleCommand
          text="setpos 1216.000244 -115.000000 -99.968750;setang -45.680534 -169.015015 0.000000"
          label="W + LMB + JUMP THROW (INST)"
          splitOnSemicolon
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
        <ConsoleCommand
          text="setpos 1216.000000 -211.000000 -99.968750;setang -45.669205 -170.268280 0.000000"
          label="W + LMB + JUMP THROW (INST)"
          splitOnSemicolon
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
        <ConsoleCommand
          text="setpos 1296.000610 -352.000061 -103.968750;setang -42.369884 -174.263123 0.000000"
          label="W + LMB + JUMP THROW (INST)"
          splitOnSemicolon
        />
      </div>

      {/* Start */}

      <h2 className="text-2xl font-semibold mb-4 text-white">Start</h2>
      <div>
        <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
        <ConsoleCommand
          text="setpos 1422.968750 36.468639 -103.968750;setang -42.325157 -160.482651 0.000000"
          label="LMB"
          splitOnSemicolon
        />
      </div>

      <div className="mb-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
            <ConsoleCommand
              text="setpos 1296.000244 32.000065 -103.968750;setang -51.497047 -159.956421 0.000000"
              label="LMB (INST)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
            <ConsoleCommand
              text="setpos 1216.000000 -16.000000 -99.968750;setang -57.162815 -158.736877 0.000000"
              label="LMB (INST)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
            <ConsoleCommand
              text="setpos 1216.000244 -115.000000 -99.968750;setang -57.192860 -164.823914 0.000000"
              label="LMB (INST)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
            <ConsoleCommand
              text="setpos 1216.000000 -211.000000 -99.968750;setang -56.984604 -167.543243 0.000000"
              label="LMB (INST)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300"></h3>
            <ConsoleCommand
              text="setpos 1296.000610 -352.000061 -103.968750;setang -55.269295 -174.359695 0.000000"
              label="LMB (INST)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              коннектор
            </h3>
            <ConsoleCommand
              text="setpos 1422.953369 36.440113 -103.968750;setang -20.432709 -158.287048 0.000000"
              label="LMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">кт</h3>
            <ConsoleCommand
              text="setpos 1097.200928 -1006.843262 -194.709229;setang -28.793440 -144.325546 0.000000"
              label="LMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флеш фанарь
            </h3>
            <ConsoleCommand
              text="setpos 871.830383 -1036.068115 -190.478333;setang -35.354313 -151.431473 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              стейрс сверху
            </h3>
            <ConsoleCommand
              text="setpos 814.919617 -1548.957031 -44.968750;setang -3.736870 178.970490 0.000000"
              label="MMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              выпуклый джангл сверху (не шьется, но под него проще играть кт)
            </h3>
            <ConsoleCommand
              text="setpos 814.919617 -1548.957031 -44.968750;setang -29.366383 -178.287613 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              не выпунклый джангл сверху (ПАЧКА легко шьется)
            </h3>
            <ConsoleCommand
              text="setpos 814.825134 -1549.072144 -44.968750;setang -3.000281 -179.979233 0.000000"
              label="LMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              молик подпаласы
            </h3>
            <ConsoleCommand
              text="setpos 571.198914 -2224.058105 24.031250;setang -9.561048 -164.101425 0.000000"
              label="LMB (бежим пока прицел не попадет на яркую часть лампы)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              двухэтажный молик под паласы через смок
            </h3>
            <ConsoleCommand
              text="setpos 272.046844 -2224.068359 24.031250;setang 8.689298 75.606979 0.000000"
              label="LMB (идем до упора зажимая A + S, когда застакаемся)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              на докидку джангл
            </h3>
            <ConsoleCommand
              text="setpos -30.468750 -1418.040283 -104.042786;setang -69.768097 -178.492828 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              на докидку топ кон
            </h3>
            <ConsoleCommand
              text="setpos -77.311218 -1475.531250 -103.968750;setang -77.283691 164.770950 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              на докидку молик кт
            </h3>
            <ConsoleCommand
              text="setpos -30.471436 -1418.028320 -104.042526;setang 3.478812 -131.133469 0.000000"
              label="LMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">флеш яма</h3>
            <ConsoleCommand
              text="setpos -554.968750 -2103.715332 -115.968750;setang -14.307788 34.754696 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флеш мид через кон
            </h3>
            <ConsoleCommand
              text="setpos -725.252563 -2178.175781 -115.968750;setang -11.143441 87.418633 0.000000"
              label="LMB (с пары шагов)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок в яму
            </h3>
            <ConsoleCommand
              text="setpos -906.253601 -2324.062256 -104.131912;setang -13.189333 33.813461 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок в кон
            </h3>
            <ConsoleCommand
              text="setpos -913.506287 -2544.561768 -103.968750;setang -21.605284 79.861450 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок в A паласы
            </h3>
            <ConsoleCommand
              text="setpos -959.000488 -2583.833984 -103.968750;setang -6.751253 60.656578 0.000000"
              label="LMB + JUMP THROW (с пары шагов до упора)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок б апсы с мусорки
            </h3>
            <ConsoleCommand
              text="setpos -2415.968750 -115.774719 -99.093353;setang -23.119209 44.165745 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флеш б апсы
            </h3>
            <ConsoleCommand
              text="setpos -1999.962524 -247.930481 -99.489929;setang -20.037222 75.623177 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              молик на ретейк A (и чуть левее граната туда же)
            </h3>
            <ConsoleCommand
              text="setpos -618.031250 -1281.800903 -103.968750;setang -15.126736 -69.120667 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флеш окно
            </h3>
            <ConsoleCommand
              text="setpos -801.971680 -788.938416 -199.158173;setang 4.664897 161.271362 0.000000"
              label="RMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">флеш вп</h3>
            <ConsoleCommand
              text="setpos 612.629028 623.659851 -71.968750;setang -3.805536 -134.511520 0.000000"
              label="LMB + JUMP THROW (c шага)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок ктичен б
            </h3>
            <ConsoleCommand
              text="setpos -160.031494 887.968750 -71.644958;setang -47.630936 -146.541687 0.000000"
              label="LMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок шорт
            </h3>
            <ConsoleCommand
              text="setpos -160.031250 887.951721 -71.644592;setang -46.103825 -134.511536 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок мейн б
            </h3>
            <ConsoleCommand
              text="setpos -160.031494 887.968750 -71.644958;setang -42.065968 -152.911697 0.000000"
              label="LMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              молик ладер
            </h3>
            <ConsoleCommand
              text="setpos -930.031250 -788.967773 -198.099274;setang -24.333469 125.918945 0.000000"
              label="LMB (подойти в упор под окно и вычислить пиксель, если в окне смок. После молика летит граната рикошетом)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флешка на ретейк А
            </h3>
            <ConsoleCommand
              text="setpos -1022.867615 -2269.522461 -103.968750;setang -69.796074 78.518013 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок паласы
            </h3>
            <ConsoleCommand
              text="setpos -774.769348 -1306.062866 -103.968750;setang -18.591492 -46.519844 0.000000"
              label="LMB (с шага)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флеш андер
            </h3>
            <ConsoleCommand
              text="setpos -608.435120 -871.380920 -190.404938;setang -22.260647 133.514435 0.000000"
              label="MMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флеш андер с окна
            </h3>
            <ConsoleCommand
              text="setpos -1120.048828 -967.429321 -103.968750;setang -13.572027 114.636467 0.000000"
              label="CTRL + LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флеш кон с джангла
            </h3>
            <ConsoleCommand
              text="setpos -992.062744 -1304.843140 -95.371155;setang -22.956358 -118.470718 0.000000"
              label="LMB (с шага)"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              БУСТ на б по тени СТОЯ
            </h3>
            <ConsoleCommand
              text="setpos -2042.346313 598.498596 -106.318970;setang 89.000000 49.682629 0.000000"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              шорт игрока
            </h3>
            <ConsoleCommand
              text="setpos -739.054688 292.968750 -80.265488;setang -16.190695 -122.204880 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              Продление смок кон
            </h3>
            <ConsoleCommand
              text="setpos 502.968750 -64.056458 -96.509949;setang -13.844892 -147.182327 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              Флеш шорт (слепит кирпичи, но не уго)
            </h3>
            <ConsoleCommand
              text="setpos 146.028259 -890.949463 -103.968750;setang -18.114103 145.858902 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              Флеш кон с топ мида
            </h3>
            <ConsoleCommand
              text="setpos 176.067673 -229.260437 -87.968887;setang -11.171309 -145.136398 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              Флеш кон с вайтов
            </h3>
            <ConsoleCommand
              text="setpos 343.325165 -621.639648 -99.047638;setang -12.003470 -170.124588 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              Флеш от упора яма (не слепит угол)
            </h3>
            <ConsoleCommand
              text="setpos 560.031250 -1399.968750 -192.233704;setang -24.061308 -19.921089 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              Внешка кон
            </h3>
            <ConsoleCommand
              text="setpos 1239.968750 -1159.972290 -188.661819;setang -24.388454 -175.321350 0.000000"
              label="LMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              Смок джангл для фаст а
            </h3>
            <ConsoleCommand
              text="setpos 1239.971558 -1159.964966 -188.663849;setang -48.449734 -173.549683 0.000000"
              label="LMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              тут просто поинть надо, не респает норм
            </h3>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              смок китчен + молик мейн + флешка мейн + смок шорт
            </h3>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              флешка мейн с симпла по тарелке
            </h3>
            <ConsoleCommand
              text="setpos -1972.452881 558.360901 -104.368149;setang 7.616072 -97.383797 0.000000"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">Смок кт</h3>
            <ConsoleCommand
              text="setpos -30.443481 -1418.034302 -104.045258;setang -14.418750 -130.869186 0.000000"
              label="CTRL + MMB + JUMP THROW"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              Молик ковры двухэтажный
            </h3>
            <ConsoleCommand
              text="setpos -77.321838 -1475.532471 -103.968750;setang -16.601248 -73.295296 0.000000"
              label="LMB"
              splitOnSemicolon
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-zinc-300">
              БУСТ АВИКА В ЯМЕ на CTRL
            </h3>
            <ConsoleCommand
              text="setpos 700.120544 -1528.742798 -199.966370;setang 89.000000 -20.946350 0.000000"
              splitOnSemicolon
            />
          </div>
        </div>
      </div>
    </div>
  );
}
