import { load as cheerioLoad } from "cheerio";
import { Game, GameRegion } from "../utils";
import { readFileSync, writeFileSync } from "fs";

type dbType = "p" | "u" | "j";

type LinkData = {
    href: string;
    name: string;
    country: string;
    used?: boolean;
};

const coolRomListURL = "https://coolrom.com.au/roms/";

const coolRomDBs: { [key in keyof typeof dbURLs]: string } = {
    psp: "psp",
    psx: "psx",
    psx2: "ps2",
};

const coolRomBaseURL = "https://coolrom.com.au";

const coolRomLists =
    "0_A_B_C_D_E_F_G_H_I_J_K_L_M_N_O_P_Q_R_S_T_U_V_W_X_Y_Z".split("_");

const countries: [string, GameRegion, string][] = [
    ["Europe", "pal", "E"],
    ["USA", "ntscu", "E"],
    ["Japan", "ntscj", "J"],
    ["China", "ntscj", "Ch"],
    ["Korea", "ntscj", "K"],
    ["Italy", "pal", "I"],
    ["Spain", "pal", "S"],
    ["Australia", "pal", "E"],
    ["Netherlands", "pal", "Du"],
    ["Sweden", "pal", "Sw"],
    ["Germany", "pal", "G"],
    ["France", "pal", "F"],
    ["Poland", "pal", "Pl"],
];

const dbURLs = {
    psp: "http://psxdatacenter.com/psp/$list.html",
    psx2: "http://psxdatacenter.com/psx2/$list2.html",
    psx: "http://psxdatacenter.com/$list.html",
};

const regions: { [key in dbType]: GameRegion } = {
    j: "ntscj",
    p: "pal",
    u: "ntscu",
};

const verboseMode = (): string | null => {
    const { argv: args } = process;
    const vIndex = args.findIndex((arg) => /\-v|\-verbose/.exec(arg));
    if (!vIndex) return null;
    if (vIndex + 1 >= args.length) return null;
    return args[vIndex + 1];
};

const fetchAllDownloadURLs = async (db: keyof typeof dbURLs) => {
    const linkData: LinkData[] = [];

    await Promise.all(
        coolRomLists.map(async (_, i) => {
            linkData.push(...(await fetchDownloadURL(db, i)));
        })
    );
    linkData.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return linkData;
};

const fetchDownloadURL = async (db: keyof typeof dbURLs, i: number) => {
    const path = coolRomListURL + coolRomDBs[db] + "/" + coolRomLists[i];
    const site = await fetch(path)
        .then((r) => r.text())
        .catch((err) => {
            console.error("Fetch error!", err);
            throw "Something went wrong!";
        });
    console.log(`Fetching link data from ${path}`);
    const $ = cheerioLoad(site);

    const data: LinkData[] = [];

    $("table table table font[size='2'] > div > a")
        .toArray()
        .forEach((e) => {
            const elem = $(e);
            const name = elem.text().replace(/\([^\)]+\)/g, "");

            const href = coolRomBaseURL + elem.attr("href");

            const country = elem.parent().attr("class") || "---";

            data.push({ name, href, country });
        });
    return data;
};

const fetchEveryGameDataFromDB = async (ps: keyof typeof dbURLs) => {
    const data: Game[] = [];
    data.push(...(await fetchFromDB(ps, "j")));
    data.push(...(await fetchFromDB(ps, "p")));
    data.push(...(await fetchFromDB(ps, "u")));
    return data;
};

const fetchFromDB = async (
    ps: keyof typeof dbURLs,
    db: keyof typeof regions
) => {
    const url = dbURLs[ps].replace("$", db);

    console.log(`Fetching game data from ${url}`);

    const site = await fetch(url)
        .then((r) => r.text())
        .catch((err) => {
            console.error("Fetching data from " + url + "failed!", err);
            throw "Something went wrong!";
        });

    const $ = cheerioLoad(site);

    const dbGames: Game[] = [];

    $(".sectiontable tr")
        .toArray()
        .forEach((e) => {
            const elem = $(e);
            const id = elem.children("td:nth-child(2)").text();
            const name = elem
                .children("td:nth-child(3)")
                .text()
                .replace(/\xa0/, "");
            const langs =
                elem
                    .children("td:nth-child(4)")
                    .text()
                    .match(/[\[\(]([^\[\(]+)[\]\)]/g)
                    ?.map((e) => e.trim().replace(/[\[\(\)\]]/g, "")) || [];
            dbGames.push({
                id,
                langs,
                name,
                region: regions[db],
            });
        });

    return dbGames;
};

const getDataFromDB = async (
    db: keyof typeof dbURLs,
    fromFile: boolean = false
): Promise<[Game[], LinkData[]]> => {
    let data: Game[];
    let linkData: LinkData[];

    if (!fromFile) {
        data = await fetchEveryGameDataFromDB(db);
        linkData = await fetchAllDownloadURLs(db);
        writeFileSync(
            `./${db}/gameData.json`,
            JSON.stringify(data, undefined, 2),
            "utf-8"
        );
        writeFileSync(
            `./${db}/linkData.json`,
            JSON.stringify(linkData, undefined, 2),
            "utf-8"
        );
        console.log("Got ", data.length, "games");
        console.log("Got ", linkData.length, "links");
        console.log("Saving games to " + `./${db}/gameData.json`);
        console.log("Saving links to " + `./${db}/linkData.json`);
    } else {
        data = JSON.parse(readFileSync(`./${db}/gameData.json`, "utf-8"));
        linkData = JSON.parse(readFileSync(`./${db}/linkData.json`, "utf-8"));
        console.log("Got ", data.length, ` ${db} games`);
        console.log("Got ", linkData.length, ` ${db} links`);
    }

    return [data, linkData];
};

const connectDataWithLinks = (
    data: Game[],
    links: LinkData[],
    db: keyof typeof dbURLs
): Game[] => {
    const checkRegion = (
        linkCountry: string,
        gameRegion: string,
        gameLanguage: string[],
        country: string,
        setRegion: GameRegion,
        setLanguage: string
    ) =>
        linkCountry === country &&
        gameRegion === setRegion &&
        gameLanguage.includes(setLanguage);

    links.reverse();

    const allGames = data.reduce<Game[]>((p, n, ix) => {
        if (p.find((g) => g.id === n.id)) return p;
        const lnk = links.find((l) => {
            const hasSameRegion = countries.reduce((p, nc) => {
                if (n.langs.length === 0) return true;
                return (
                    p ||
                    checkRegion(
                        l.country,
                        n.region,
                        n.langs,
                        nc[0],
                        nc[1],
                        nc[2]
                    )
                );
            }, false);
            const hasSameName =
                n.name.replace(/[^a-z\d]/gi, "").toLowerCase() ===
                l.name.replace(/[^a-z\d+]/gi, "").toLowerCase();
            const vMode = verboseMode();
            if (vMode) {
                const RX = new RegExp(vMode, "i");
                if (n.name.match(RX) && l.name.match(RX)) {
                    console.log(
                        l.country,
                        n.langs,
                        n.region,
                        hasSameRegion,
                        n.name.replace(/[^a-z\d]/gi, ""),
                        l.name.replace(/[^a-z\d+]/gi, ""),
                        hasSameName
                    );
                }
            }
            return hasSameRegion && hasSameName;
        });
        if (lnk) {
            lnk.used = true;
            return [...p, { ...n, link: lnk.href }];
        }
        return [...p, n];
    }, []);
    const unused = links.filter((l) => !l.used);
    const usedCount = links.length - unused.length;
    console.log(
        `Links used: `,
        usedCount,
        `/`,
        links.length,
        " ",
        (usedCount / links.length) * 100,
        `%`
    );
    console.log("Saving unused links to " + `./${db}/gameData.json`);
    writeFileSync(
        `./${db}/unusedLinks.json`,
        JSON.stringify(unused, undefined, 2)
    );
    return allGames;
};

const getConnectedDataFromDB = async (db: keyof typeof dbURLs) => {
    const [d, l] = await getDataFromDB(db, !1);
    return connectDataWithLinks(d, l, db);
};

const writeData = (db: keyof typeof dbURLs, data: Game[]) => {
    console.log(`Got ${data.length} ${db} games`);
    console.log(
        `Got `,
        data.filter((r) => !!r.link).length,
        ` ${db} games with links`
    );
    console.log(`Saving to ./${db}/data.json`);
    writeFileSync(`./${db}/data.json`, JSON.stringify(data), {
        encoding: "utf-8",
    });
};

const main = async () => {
    try {
        console.log("Verbose mode: ", verboseMode() || "false");
        console.log("======== PSPortable ========");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        await getConnectedDataFromDB("psp").then((data) =>
            writeData("psp", data)
        );

        console.log("Waiting 60s");
        await new Promise((res) => setTimeout(res, 60 * 1000));
        console.log("============ PS1 ===========");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        await getConnectedDataFromDB("psx").then((data) =>
            writeData("psx", data)
        );

        console.log("Waiting 60s");
        await new Promise((res) => setTimeout(res, 60 * 1000));
        console.log("============ PS2 ===========");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        console.log("============================");
        await getConnectedDataFromDB("psx2").then((data) =>
            writeData("psx2", data)
        );
    } catch (err) {
        console.error(err);
    }
};

main();

// fetchDownURL(3);
