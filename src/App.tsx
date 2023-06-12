import "./App.css";
import { useEffect, useRef, useState } from "react";

import pspGames from "./assets/psp/games.json";
import { Filter, Game, GamePack } from "./utils";

import FilteredGameTable from "./FilteredGameTable/FGT";

const Games: GamePack = {
    psp: pspGames as Game[],
    ps2: [],
    psx: [],
};

function App() {
    const [searchQuery, setSearchQuery] = useState("");

    const [currentGamePack, setCurrentGamePack] =
        useState<keyof GamePack>("psp");

    const [foundCount, setFoundCount] = useState(Games[currentGamePack].length);

    const [editMode, setEditMode] = useState(false);

    const [ntscu, setNtscu] = useState(true);
    const [ntscj, setNtscj] = useState(true);
    const [pal, setPal] = useState(true);

    const promptEditRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (location.pathname === "/edit") setEditMode(true);
    }, []);

    const getFiltersFromString = (query: string): Filter[] => {
        const queries = query.trim().split("\n");
        const filters = queries.reduce<Filter[]>((p, n) => {
            const [_all, link, name, id, lang] =
                /^(!)?([^#]*?)(?:#(.*?))?(?:\((.*?)\))?$/.exec(n) || [];
            if (link || name || id || lang) {
                return [
                    ...p,
                    {
                        link,
                        name,
                        id,
                        lang: lang ? lang.split(",") : undefined,
                    },
                ];
            }
            return p;
        }, []);
        return filters;
    };

    const searchQueries: Filter[] = getFiltersFromString(searchQuery);

    return (
        <>
            <label htmlFor="ntscu">NTSCU</label>
            <input
                type="checkbox"
                name="ntscu"
                id="ntscu"
                checked={ntscu}
                onChange={(e) => setNtscu(e.currentTarget.checked)}
            />
            <br />
            <label htmlFor="ntscj">NTSCJ</label>
            <input
                type="checkbox"
                name="ntscj"
                id="ntscj"
                checked={ntscj}
                onChange={(e) => setNtscj(e.currentTarget.checked)}
            />
            <br />
            <label htmlFor="pal">PAL</label>
            <input
                type="checkbox"
                name="pal"
                id="pal"
                checked={pal}
                onChange={(e) => setPal(e.currentTarget.checked)}
            />
            <br />
            {editMode && (
                <>
                    <label htmlFor="ntscu">Prompt edit</label>
                    <input
                        type="checkbox"
                        name="prompt"
                        id="prompt"
                        ref={promptEditRef}
                    />
                    <br />
                </>
            )}
            <div className="tx">
                <textarea
                    name=""
                    id=""
                    cols={30}
                    rows={10}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                ></textarea>
                <p>Found: {foundCount}</p>
                <b>Instruction:</b>
                <br />
                Syntax:
                <br />! - downloadable
                <pre>
                    <br />
                    {"[!][<query>]*"} (or) where:,
                    <br />
                    &emsp;{"<query>:"}
                    <br />
                    &emsp;&emsp;{"[<name>][#<id>][(<lang>[,<lang>]*)]"} (and)
                    where:
                    <br />
                    &emsp;&emsp;{"<name>"}: Name of the game (i.e wall-e)
                    <br />
                    &emsp;&emsp;{"<id>"}: ID of the game (i.e. ULES-0988 or
                    ROSE-)
                    <br />
                    &emsp;&emsp;{"<lang>"}: Letter of language (i.e. K or Du)
                    <br />
                </pre>
                Examples:
                <pre>
                    &emsp;wall(I)
                    <br />
                    &emsp;wall#ulus
                </pre>
            </div>
            <FilteredGameTable
                games={Games[currentGamePack]}
                editMode={
                    editMode && {
                        prompt: promptEditRef.current?.checked || false,
                    }
                }
                setFoundCount={setFoundCount}
                regionLock={{ ntscj, ntscu, pal }}
                search={searchQueries}
            />
            {editMode && (
                <button
                    className="permasave"
                    onClick={() => {
                        const blob = new Blob(
                            [JSON.stringify(pspGames, null, 4)],
                            {
                                type: "application/json",
                            }
                        );
                        const a = document.createElement("a");
                        a.download = "games.json";
                        a.href = URL.createObjectURL(blob);
                        a.click();
                    }}
                >
                    Save
                </button>
            )}
        </>
    );
}

export default App;
