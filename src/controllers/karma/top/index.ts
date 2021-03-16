import database from "../../../database";
import {TypeKarmaTotal} from "src/types/karma";

/**
 * Get server leaderboard
 */
export async function getServerKarmaLeaderboard(serverID: string): Promise<TypeKarmaTotal[]> {
    const top = await database("karma_total").where({serverID}).orderBy("total", "desc").limit(10);
    return top;
}
