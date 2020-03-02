import {TextChannel, DMChannel, GroupDMChannel} from "discord.js";

/**
 * Channel is mostly one of these 3 types. But it's too long to type this out every time
 * That's how this type got born
 */
export type Channel = TextChannel | DMChannel | GroupDMChannel;
