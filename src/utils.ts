export type GameRegion = "ntscj" | "ntscu" | "pal";

export type Game = {
    id: string;
    name: string;
    langs: string[];
    region: GameRegion;
    link?: string;
};

export type GamePack = {
    psp: Game[];
    ps2: Game[];
    psx: Game[];
};
export type RegionLock = {
    [key in GameRegion]: boolean;
};

export type Filter = {
    link: string;
    name: string;
    id: string;
    lang?: string[];
};
