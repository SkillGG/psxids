import { FC, useEffect, useRef, useState } from "react";
import { Filter, Game, RegionLock } from "../utils";

interface GameTableProps {
    search: Filter[];
    regionLock: RegionLock;
    games: Game[];
    editMode: { prompt: boolean } | false;
    setFoundCount: React.Dispatch<React.SetStateAction<number>>;
}

const GameTable: FC<GameTableProps> = ({
    search,
    games,
    regionLock,
    editMode,
    setFoundCount,
}) => {
    const { ntscu, ntscj, pal } = regionLock;

    const tbodyRef = useRef<HTMLTableSectionElement>(null);
    const [editID, setEditID] = useState<string>("");
    const editRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log("Number of entries changed");
        setFoundCount((p) => tbodyRef.current?.childElementCount || p);
    }, [tbodyRef.current?.childElementCount, search, games]);

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>DBID</th>
                        <th>REGION</th>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>LANGS</th>
                    </tr>
                </thead>
                <tbody ref={tbodyRef}>
                    {games.map((game, gameIndex) => {
                        if (
                            !`${ntscu ? "ntscu" : ""}_${pal ? "pal" : ""}_${
                                ntscj ? "ntscj" : ""
                            }`.includes(game.region)
                        )
                            return;
                        if (
                            search.length > 0 &&
                            !search.reduce((p, n, xi, a) => {
                                const { id, name, lang, link } = n || {};
                                const check = (
                                    i: string,
                                    title: string,
                                    l: string[],
                                    lnk: string = ""
                                ): boolean => {
                                    if (link && !lnk) return false;
                                    if (
                                        lang &&
                                        lang.filter((x) =>
                                            l.includes(x.toLowerCase())
                                        ).length === 0
                                    )
                                        return false;
                                    if (id && name)
                                        return (
                                            i.includes(id.toLowerCase()) &&
                                            title.includes(name.toLowerCase())
                                        );
                                    if (id) return i.includes(id.toLowerCase());
                                    if (name)
                                        return title.includes(
                                            name.toLowerCase()
                                        );
                                    return !!lang || !!link;
                                };
                                return (
                                    p ||
                                    check(
                                        game.id.toLowerCase(),
                                        game.name.toLowerCase(),
                                        game.langs.map((l) => l.toLowerCase()),
                                        game.link
                                    )
                                );
                            }, false)
                        ) {
                            return null;
                        } else
                            return (
                                <tr key={`${game.id}`}>
                                    <td>{gameIndex + 1}.</td>
                                    <td style={{ textAlign: "center" }}>
                                        {game.region.toUpperCase()}
                                    </td>
                                    <td>{game.id}</td>
                                    <td>
                                        {game.link ? (
                                            <a href={game.link}>{game.name}</a>
                                        ) : (
                                            <>{game.name}</>
                                        )}
                                        {editMode &&
                                            (editID === game.id ? (
                                                <div className="editbtn">
                                                    <input ref={editRef} />
                                                    <input
                                                        type="button"
                                                        value="Save"
                                                        onClick={() => {
                                                            const newLink =
                                                                editRef.current
                                                                    ?.value;
                                                            console.log(
                                                                newLink,
                                                                editRef.current
                                                            );
                                                            if (
                                                                newLink &&
                                                                newLink.length >
                                                                    0
                                                            )
                                                                game.link =
                                                                    newLink;
                                                            else
                                                                delete game.link;
                                                            setEditID("");
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        className="editbtn"
                                                        onClick={() => {
                                                            if (
                                                                !editMode.prompt
                                                            )
                                                                setEditID(
                                                                    game.id
                                                                );
                                                            else {
                                                                const newLink =
                                                                    prompt(
                                                                        "New link:",
                                                                        game.link ||
                                                                            ""
                                                                    );
                                                                if (
                                                                    newLink ===
                                                                    null
                                                                )
                                                                    return;
                                                                else {
                                                                    if (
                                                                        newLink.length ===
                                                                        0
                                                                    )
                                                                        delete game.link;
                                                                    else
                                                                        game.link =
                                                                            newLink;
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    {game.link && (
                                                        <button
                                                            className="editbtn"
                                                            onClick={() => {
                                                                delete game.link;
                                                                setEditID((p) =>
                                                                    p ? "" : "-"
                                                                );
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </>
                                            ))}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {game.langs.join(", ")}
                                    </td>
                                </tr>
                            );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default GameTable;
