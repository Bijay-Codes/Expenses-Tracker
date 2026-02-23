import { category, categoryLimits } from "./category.js";
import { collectiveExpenses } from "./expenses.js";
import "https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js";
// indecisive behavior by user by editing more than adding expenses.
let tier1Indecisive;
let tier2Indecisive;
let tier3Indecisive;
// deleter by deleting more than adding expenses which is weird behavior.
let tier1Deleter;
let tier2Deleter;
let tier3Deleter;
// full chaos edit/add/delete no mercy shown.
let tier1Chaos;
let tier2Chaos;
let tier3Chaos;
// roast by tags usage
export const redFlagTags = [
    'Regret', 'Impulse', 'YOLO', 'Peer pressure',
    'Emotional buy', 'Total waste', 'Overpriced',
    'For the flex', 'Never again', 'Stupid but fun'
];
export const redFlagCategory = ['Restaurants & Takeout', 'Coffee & Snacks', 'Subscriptions', 'Fitness & Wellness',
    'Entertainment', 'Hobbies'
];


export const roastParameters = {
    tier1: {
        indecisive: 0.4,
        deleter: 0.3,
        chaos: 0.7,
    },
    tier2: {
        indecisive: 0.8,
        deleter: 0.5,
        chaos: 0.9,
    },
    tier3: {
        indecisive: 0.8,
        deleter: 0.5,
        chaos: 1
    },
    userTier: 15,
    specificRoast: undefined,
    maxTime: 40,
    minTime: 16
}
/*
Sooo why this roast parameters object exist? its just because in future if i add a feature
to tweak how the users get roasted i just need to change this objects data rather than touching the
main roasting codes. futher more if i think the new users are getting roasted way too much
i can adjust it here as well.
*/
function makeRoastsForAdding(data) {
    const tags = data.tags;
    const category = data.category;
    const amount = data.amount;
    const lowTier = [
        `Okie Dokie 🔥`, `Noted`, `Duely Noted`, `Sure bud`,
        `Wrote it`, `Wrote in History... Forever`, `Find you in Home page`,
        `Happy to Work with you`, `Cheap...`, `Sure, Writing it Down.`, `Run out of pages! oh wait i dont write on pages.`,
        `Picking it up`, `More and More`, `You have been added to the list... oh wait. I wrote your Transaction down. My bad lol`,
        `Happy Happy Happy`, `More Transactions to Roast`, `Oops Made a mistake. NVM i corrected it.`,
        `I feel like someone wrote something in Homepage. Check it out?`, `Must've Been Wind.`, `Cool`, `I feel Dizzy after reading that.`,
        `oh there goes another one`, `Well Anything Else?`, `Cheer me up too -_-`, `Good one`,
        `Pretty good.`, `im not so sure but alright i will note it down.`
    ];
    const midTier = [
        `Well? ${amount} For ${category} Sure.`,
        `Its still expensive Bargain more man.`,
        `Your Crime has been Written in the records ${amount} : ${category}`,
        `What do you mean YOU SPENT on ${category} : ${amount} are you sure? no Typo?`,
        `It still Stings right. Just look at it ${amount} 💸`,
        `Money sure Flies`,
        `Look at the Sky its your money flying away. cant catch it now though`,
        `WOW ${amount} on ${category} With 
        ${data.tags.includes('😌 Worth it') || tags.includes('🤑 Great deal') ? 'Satisfaction?' : 'Unplanned i guess'}`,
        `How does it feel? spending ${amount} on a Mealsy ${category}?`,
        `There must be a way to get it Cheaper Right? Well i should keep writting...`,
        `${tags.includes('🚫 Never again') || tags.includes('🔥 Splurge')
            || tags.includes('🗑️ Total waste') || tags.includes('🤦‍♂️ Regret') ?
            'You say you regret your decision but i know you will do it again. So do you' :
            `Well you Tag it as Essential but do you really fell that way? We will know for sure in Stats page i guess. see you soon.`}`,
        `HAHAHA this is Funny. Oh wait back to the Job.`,
        `I cant even be myself... Anyways Noted.`,
        `Lets play a Game. I will gues what you will do Next. My bet you will delete this Transaction.`,
        `You probably thought no one will Judge... But i do...`,
        `I Read your transactions at 3am but well? you did this transaction at 3am as well? wow. Did i Startle you or is it actually true?`,
        `Not sure what to spend on next? How about ${category} for ${amount} at ${dayjs(data.datetime).format('dddd MMM, DD')} with ${data.paymentMode === '0' ? 'Online' : 'Offline'}. Yep i see everything.`,
        `Scary right. Being judged for spending ${amount} on ${category} ? You chose this i didn't. Its on you.`,
        `Like watching Horror Movies? I do too i watch Your Transactions part${collectiveExpenses.length} DAILY at 3am. Its Really Scary.`,
        `Im lucky im not human... if i was id have to spend like a maniac as well.`,
        `Dont Tell me you spent on ${category} again. Wait a minute its price was ${amount} No praise required You dont need any.`,
        `You should be thankfull to me reading this out: ${amount}-${category}`,
        `ohh there we go again, This category well? Stop it like seriously`,
        `Its Pointless to mock you, you will do this again right? i hope you do i enjoy mocking you haha.`
    ];
    const highTier = [
        `Ohh This Price(${category}) is so peakkk good job someone played you. ${category} This as well? Well im disappointed.`,
        `Its so bad that i have to do this, oh well here we go again.`,
        `${category} and ${amount}. Either my data is wrong or you did get too overboard with your spending session.`,
        `What if i showed this to your Family? Will they scold you? oh they wont be pleased seeing ${amount} for ${category}`,
        `I still cant wrap my head a round how you manage to spend soo high. like its Literally ${(amount / (categoryLimits[category].max / 2) * 100)}% Greater than normal price.`,
        `Im starting to beleive that this might be the most NORMAL price(${amount}) for YOU.`,
        `${data.paymentMode === '0' ? 'Online' : 'Offline'} Might be the best method of payment right... For you`,
        `Stop Buying for such High prices it hurts my soul 😭 ${amount} for ${category} and at this time... Just Why.`,
        `How about you ask or literally google the most common and normal price before you buy stuff? That would be a blessing for you.`,
        `welp you definetly need a friend to hold your hands while spending like for real Your history is way worse than i im used to.`,
        `No comments ${amount} at ${category}. You know the rest right.`,
        `Sure Like i will belive that you spent ${amount} on ${category}. Rediculous. Absolutely Rediculous.`,
        `Its Pointless for me to do these. I know but i will.`,
        `Playing with me? We will see about that.`,
        `Massacre... you call this Expenses Logs?`,
        `OH well did you know you only have 24 hours before you can Edit or Delete this transaction hahaha.`,
        `Deleting this record? i wont forget it, Edit it? i will still know the difference... its pointless so just leave it. Be Honest.`,
        `Did you notice being played or clueless till now? ${amount}, ${category}. Figure it out man.`,
        `How does this makes sense...`,
        `Add, Add, Add its so boring to see this person do the same mistakes again and again.`,
        `Im placing you in my Watchlist. Thats what you need.`,
        `Please Free me from this man. i cant read his transactions anymore.`
    ];
    return { tier1: lowTier, tier2: midTier, tier3: highTier }
};

export function makeRoast(ratio, scores) {
    // indecisive...
    tier1Indecisive = [
        `You've edited ${scores.editCount} out of ${scores.addCount} expenses ¯\\_(ツ)_/¯ Not terrible, but I will see you next time.`,
        `Edit rate: ${Math.round(ratio.EditbyAdd * 100)}%. Your data's mostly clean... Mostly... (¬_¬)`,
        `${scores.editCount} edits so far 🤔 Im starting to see a pattern here.`,
        `You edit ${Math.round(ratio.EditbyAdd * 100)}% of the time. Room for improvement, but you could be worse.`,
        `${scores.editCount}/${scores.addCount} edited ಠ_ಠ Commitment's... shaky, but we'll allow it.`
    ];
    tier2Indecisive = [
        `You've edited ${scores.editCount} times out of ${scores.addCount} expenses (⊙_⊙) That's not tracking, that's performance art.`,

        `Edit ratio: ${Math.round(ratio.EditbyAdd * 100)}%. You spend more time fixing expenses than making them. Impressive dysfunction 👏`,

        `${scores.editCount} edits on ${scores.addCount} expenses ಠ_ಠ Do you even remember what you actually spent?`,

        `You edit almost as often as you add ( ･ิω･ิ) At this point, just guess your expenses and call it a day.`,

        `For every expense you add, you edit it ${ratio.EditbyAdd.toFixed(1)} times ┐(￣ヮ￣)┌ Your commitment issues have commitment issues.`,

        `${scores.editCount}/${scores.addCount} ಥ_ಥ You've mastered the art of financial indecision. Congrats, I guess?`,

        `You've achieved ${Math.round(ratio.EditbyAdd * 100)}% edit rate 🫠 That's not budgeting, that's anxiety with spreadsheet features.`
    ];
    tier3Indecisive = [
        `You've edited MORE times (${scores.editCount}) than you've added expenses (${scores.addCount}) (°ロ°) How is that even possible?`,

        `Edit count: ${scores.editCount}. Add count: ${scores.addCount} 💀 You edit MORE than you add. Seek professional help.`,

        `You've somehow edited ${scores.editCount} times while only adding ${scores.addCount} expenses ಠ▃ಠ Math is crying. I'm crying Too.`,

        `${scores.editCount} edits vs ${scores.addCount} adds 😵‍💫 You're not tracking expenses, you're having an existential crisis.`,

        `Congratulations 🎉 You've achieved the impossible: editing more than adding. Your prize is this roast.`
    ];
    // deleter...
    tier1Deleter = [
        `${scores.deleteCount} expenses deleted 💀 That's ${Math.round(ratio.DeletebyAdd * 100)}%. You're lying to yourself and it's pathetic.`,
        `Delete ratio: ${Math.round(ratio.DeletebyAdd * 100)}% (ಠ_ಠ) One in ${Math.round(1 / ratio.DeletebyAdd)} expenses gets erased. Can't handle reality?`,
        `${scores.deleteCount} transactions deleted 🙃 You're not tracking, you're hiding like a child.`,
        `You've deleted ${Math.round(ratio.DeletebyAdd * 100)}% of your expenses 😵‍💫 Accountability is a foreign concept to you.`,
        `${scores.deleteCount}/${scores.addCount} deleted 👁️👄👁️ Your budget's fiction. Your debt is real. Choose wisely.`
    ];
    tier2Deleter = [
        `${scores.deleteCount} deleted expenses 😬 That's one in five. You're not tracking, you're editing reality.`,
        `Delete ratio: ${Math.round(ratio.DeletebyAdd * 100)}%. Denial's your coping mechanism, huh? (ಠ_ಠ)`,
        `You've removed ${scores.deleteCount} transactions 🙃 Can't handle the truth?`,
        `${Math.round(ratio.DeletebyAdd * 100)}% of your expenses vanished. Your wallet still feels it though.`,
        `${scores.deleteCount}/${scores.addCount} deleted 👁️👄👁️ Rewriting history one expense at a time.`
    ];
    tier3Deleter = [
        `${scores.deleteCount} DELETED? 🫠 That's ${Math.round(ratio.DeletebyAdd * 100)}%. You're not budgeting, you're in denial and it's embarrassing.`,
        `${Math.round(ratio.DeletebyAdd * 100)}% deletion rate (°ロ°) Almost HALF your expenses vanished. Your creditors don't forget like you do.`,
        `You've nuked ${scores.deleteCount} transactions ಠ▃ಠ Running from the truth won't fix your broke ass.`,
        `Delete ratio: ${Math.round(ratio.DeletebyAdd * 100)}% 💀 You're a coward who can't face their own spending. Pathetic.`,
        `${scores.deleteCount}/${scores.addCount} deleted 🤡 Half your budget is fantasy. Grow up and face reality.`
    ];
    // chaos...
    tier1Chaos = [
        `Chaos score: ${ratio.EditDeletebyAdd.toFixed(2)} 🫠 You've made ${scores.editCount + scores.deleteCount} corrections on ${scores.addCount} expenses. Get it together.`,
        `${scores.editCount} edits + ${scores.deleteCount} deletes = ${scores.editCount + scores.deleteCount} total fuckups (ಠ_ಠ) Your life's a mess, isn't it?`,
        `You correct yourself ${Math.round(ratio.EditDeletebyAdd * 100)}% as often as you add expenses 💀 Chaos incarnate.`,
        `${scores.editCount + scores.deleteCount} corrections on ${scores.addCount} expenses 😵‍💫 Do you make ANY decision correctly the first time?`,
        `Chaos ratio: ${ratio.EditDeletebyAdd.toFixed(2)} 🤡 You're almost as good at fixing mistakes as you are at making them.`
    ];
    tier2Chaos = [
        `Chaos score: ${ratio.EditDeletebyAdd.toFixed(2)} (°ロ°) You fix things almost as often as you add them. This is beyond pathetic.`,
        `${scores.editCount} edits + ${scores.deleteCount} deletes = ${scores.editCount + scores.deleteCount} corrections 💀 For ${scores.addCount} expenses. You're a walking disaster.`,
        `${Math.round(ratio.EditDeletebyAdd * 100)}% chaos rate ಠ▃ಠ Every expense is a gamble. You can't commit to ANYTHING.`,
        `You've corrected ${scores.editCount + scores.deleteCount} times on ${scores.addCount} expenses 🫠 Your indecision is actually impressive. Impressively SAD.`,
        `Chaos ratio: ${ratio.EditDeletebyAdd.toFixed(2)} 😵 One correction per expense. Your life's an unending cycle of regret and you deserve it.`
    ];
    tier3Chaos = [
        `CHAOS SCORE: ${ratio.EditDeletebyAdd.toFixed(2)} 💀 You've made MORE corrections (${scores.editCount + scores.deleteCount}) than expenses added (${scores.addCount}). How do you even function?`,
        `${scores.editCount} edits + ${scores.deleteCount} deletes = ${scores.editCount + scores.deleteCount} 🤡 That's MORE than your ${scores.addCount} expenses. You're not human, you're a catastrophe.`,
        `Over 100% chaos rate (°□°) ಠ_ಠ You correct MORE than you add. Seek help. Genuinely. This is concerning.`,
        `${scores.editCount + scores.deleteCount} corrections vs ${scores.addCount} adds 🫠 You've broken math AND basic life skills. Congrats, you absolute gremlin.`,
        `Chaos: ${ratio.EditDeletebyAdd.toFixed(2)} 😵‍💫 MORE corrections than expenses. You're not tracking money, you're having a breakdown. Get therapy.`
    ];
    // tier1 tags
};

export function getRoast(tier, category, ratio, scores) {
    makeRoast(ratio, scores);
    if (category === 'EditbyAdd') {
        if (tier === 1) {
            const randomNum = Math.floor(Math.random() * tier1Indecisive.length);
            return tier1Indecisive[randomNum];
        } else if (tier === 2) {
            const randomNum = Math.floor(Math.random() * tier2Indecisive.length);
            return tier2Indecisive[randomNum];
        } else {
            const randomNum = Math.floor(Math.random() * tier3Indecisive.length);
            return tier3Indecisive[randomNum];
        };
    } else if (category === 'DeletebyAdd') {
        if (tier === 1) {
            const randomNum = Math.floor(Math.random() * tier1Deleter.length);
            return tier1Deleter[randomNum];
        } else if (tier === 2) {
            const randomNum = Math.floor(Math.random() * tier2Deleter.length);
            return tier2Deleter[randomNum];
        } else {
            const randomNum = Math.floor(Math.random() * tier3Deleter.length);
            return tier3Deleter[randomNum];
        };
    } else if (category === 'EditDeletebyAdd') {
        if (tier === 1) {
            const randomNum = Math.floor(Math.random() * tier1Chaos.length);
            return tier1Chaos[randomNum];
        } else if (tier === 2) {
            const randomNum = Math.floor(Math.random() * tier2Chaos.length);
            return tier2Chaos[randomNum];
        } else {
            const randomNum = Math.floor(Math.random() * tier3Chaos.length);
            return tier3Chaos[randomNum];
        };
    }

};

function makeTagRoasts(cleanTags, tag) {
    if (cleanTags === 'Regret') {
        return {
            tier1: [
                `Used the Regret tag ${tag[1]} time(s)... okay mistakes happen. We'll let it slide. For now. ¯\\_(ツ)_/¯`,
                `${tag[1]} regret(s) this month. Honestly? Respectable self-awareness. Doesn't fix anything though.`,
                `Regret × ${tag[1]}. At least you know. That's more than most people can say. Unfortunately.`
            ],
            tier2: [
                `🤦‍♂️ Regret tagged ${tag[1]} times. Are you even trying to stop or just documenting the spiral?`,
                `${tag[1]} regrets this month and you still haven't learned. The definition of insanity is doing the same thing... you know the rest. ￣へ￣`,
                `Reading your logs I genuinely can't tell if you regret buying these or just enjoy the drama of tagging it. ${tag[1]} times. This month alone.`
            ],
            tier3: [
                `${tag[1]} REGRETS. In one month. That's not a spending habit that's a personality disorder with a payment method. 💀`,
                `You've tagged Regret ${tag[1]} times and somehow kept opening this app to add MORE. The regret clearly isn't doing anything. ಠ_ಠ`,
                `${tag[1]} regrets logged. Documented. Saved to localStorage. And you'll do it again next month won't you. Won't you. 🫠`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'Impulse') {
        return {
            tier1: [
                `⚡ ${tag[1]} impulse buy(s). Could be worse. Could also be better. Mostly worse.`,
                `Impulse × ${tag[1]}. The checkout button called and you answered. Every time.`,
                `${tag[1]} unplanned purchases. Your brain said want it, your wallet said okay. Nobody asked your budget.`
            ],
            tier2: [
                `⚡ ${tag[1]} impulse buys this month. You are not built for a sale section. Stay away from sale sections.`,
                `${tag[1]} times your brain said "I need this" and zero times it was right. ¯\\_(ツ)_/¯`,
                `Impulse tagged ${tag[1]} times. You don't have a spending problem you have a 3-second decision making problem.`
            ],
            tier3: [
                `${tag[1]} IMPULSE BUYS. You didn't plan a single one. Not one. Your wallet is just vibes at this point. 💀`,
                `⚡ ${tag[1]} times this month you saw something, wanted it, bought it, and thought zero thoughts in between. Genuinely impressive. (°ロ°)`,
                `${tag[1]} impulse purchases. Your bank account isn't a budget it's a damage report. Get it together. 🤡`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'YOLO') {
        return {
            tier1: [
                `😈 YOLO × ${tag[1]}. Living in the moment. Your future self will have thoughts about this.`,
                `${tag[1]} YOLO purchase(s). Bold. Reckless. Technically valid. Financially questionable.`,
                `Tagged YOLO ${tag[1]} time(s). The audacity is actually kind of admirable. Kind of.`
            ],
            tier2: [
                `😈 YOLO × ${tag[1]} this month. You only live once but your rent is due every single month. ¯\\_(ツ)_/¯`,
                `${tag[1]} purchases justified with YOLO. That's not a philosophy that's a coping mechanism with emojis.`,
                `You've said YOLO to your money ${tag[1]} times this month. Your money has started saying it back. 🫠`
            ],
            tier3: [
                `${tag[1]} YOLO tags. You are not living once, you are spending multiple times on things you don't need. That's the opposite of the point. 💀`,
                `😈 ${tag[1]} times. YOLO doesn't mean spend recklessly it means make it count. These did not count. ಠ_ಠ`,
                `YOLO × ${tag[1]}. At this rate your future self is going to be so disappointed in your past self. They're already drafting the letter. 😵‍💫`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'Peer pressure') {
        return {
            tier1: [
                `👀 Peer pressure × ${tag[1]}. Someone said "come on" and you folded. It happens.`,
                `${tag[1]} purchase(s) because someone else wanted you to. At least you're honest about it.`,
                `Bought something ${tag[1]} time(s) because of other people. Your wallet is too friendly.`
            ],
            tier2: [
                `👀 ${tag[1]} times someone else decided what you spend your money on this month. Do you even have opinions?`,
                `Peer pressure tagged ${tag[1]} times. You are a grown adult who cannot say no to people apparently. ￣へ￣`,
                `${tag[1]} purchases that weren't even your idea. This isn't a budget this is a group project you keep funding alone.`
            ],
            tier3: [
                `👀 ${tag[1]} PEER PRESSURE tags. You funded other people's ideas ${tag[1]} times with YOUR money. In ONE month. That's not generosity that's a spine problem. 💀`,
                `${tag[1]} times someone else made your financial decisions this month. Who are these people and why do they have access to your wallet. (°ロ°)`,
                `Peer pressure × ${tag[1]}. You are the most expensive friend in the group and somehow still the one getting pressured. Fix this. 🤡`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'Emotional buy') {
        return {
            tier1: [
                `💔 ${tag[1]} emotional purchase(s). Retail therapy is real. It also doesn't work but that's a you problem.`,
                `Bought something ${tag[1]} time(s) with feelings instead of logic. We've all been there. Some more than others.`,
                `${tag[1]} emotional buy(s). The item didn't fix the feeling did it. Did it though.`
            ],
            tier2: [
                `💔 ${tag[1]} emotional purchases this month. Your feelings have expensive taste and terrible financial advice.`,
                `You bought something because of emotions ${tag[1]} times. Therapy is cheaper long term just so you know. ¯\\_(ツ)_/¯`,
                `${tag[1]} times your mood made a financial decision this month. Your mood is not qualified for this role.`
            ],
            tier3: [
                `💔 ${tag[1]} EMOTIONAL BUYS. That's not self care that's self sabotage with a receipt. 😵‍💫`,
                `${tag[1]} purchases driven by feelings this month. Your emotions have spent more than your brain this month and it shows. ಠ_ಠ`,
                `You emotionally bought something ${tag[1]} times. The thing didn't fix it. The next thing won't either. Please consider alternatives. 🫠`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'Total waste') {
        return {
            tier1: [
                `🗑️ ${tag[1]} total waste(s). You already know. Nothing more to add.`,
                `Admitted ${tag[1]} purchase(s) were completely useless. Brutal self-awareness. Doesn't help but okay.`,
                `${tag[1]} waste(s) logged. At least you're not lying to yourself. Just lying to your bank account.`
            ],
            tier2: [
                `🗑️ ${tag[1]} total wastes this month. Not impulse, not regret — you KNOW it was useless and you did it anyway. (⊙_⊙)`,
                `${tag[1]} purchases you've already written off as garbage. While still keeping them. Interesting choice.`,
                `Tagged Total Waste ${tag[1]} times. You are actively funding your own disappointment. ￣へ￣`
            ],
            tier3: [
                `🗑️ ${tag[1]} TOTAL WASTES. You didn't accidentally waste money you committed to it ${tag[1]} separate times. That's not a mistake that's a strategy. 💀`,
                `${tag[1]} purchases that you yourself have classified as completely worthless. ${tag[1]}. This month. I don't even have a joke. ಠ▃ಠ`,
                `Total Waste × ${tag[1]}. You are the reason the money is gone. You knew. You did it anyway. Respect and concern in equal measure. 😵‍💫`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'Overpriced') {
        return {
            tier1: [
                `💸 Paid too much ${tag[1]} time(s). The audacity of these prices and the bigger audacity of paying them.`,
                `${tag[1]} overpriced purchase(s). You knew. You paid anyway. That's called a choice.`,
                `Overpriced × ${tag[1]}. Someone saw you coming and they were right to.`
            ],
            tier2: [
                `💸 ${tag[1]} times you paid more than you should have this month. You are the target demographic for every premium tier.`,
                `Overpriced tagged ${tag[1]} times. You have expensive habits and a non-expensive bank account. Pick one. ¯\\_(ツ)_/¯`,
                `${tag[1]} overpriced purchases. You didn't get ripped off once, you got ripped off ${tag[1]} times and kept going back. (⊙_⊙)`
            ],
            tier3: [
                `💸 OVERPRICED × ${tag[1]}. You are single-handedly keeping luxury margins alive with a non-luxury income. Incredible. 💀`,
                `${tag[1]} times you saw a price, thought "that's too much," and paid it anyway. ${tag[1]} times. This month. ಠ_ಠ`,
                `Paid overpriced ${tag[1]} times and logged every single one. You know it's wrong. You feel it's wrong. You do it anyway. That's a villain arc. 🫠`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'For the flex') {
        return {
            tier1: [
                `📸 ${tag[1]} purchase(s) for the flex. Who are you showing this to. Are they impressed. Are you sure.`,
                `Flexed ${tag[1]} time(s) this month. The audience may or may not exist. The expense definitely does.`,
                `${tag[1]} flex purchase(s). Bold strategy. Let's see if it pays off.`
            ],
            tier2: [
                `📸 ${tag[1]} purchases just for the image. You are paying money to seem like a different person to people who aren't thinking about you. ¯\\_(ツ)_/¯`,
                `Flexed ${tag[1]} times this month. The people you're flexing on have their own problems. They did not notice. 😐`,
                `${tag[1]} for-the-flex purchases. The clout is temporary. The credit card bill is permanent. ￣へ￣`
            ],
            tier3: [
                `📸 ${tag[1]} FLEX PURCHASES. You have spent real money ${tag[1]} times this month on other people's perception of you. They don't care. They genuinely don't. 💀`,
                `${tag[1]} purchases just to look good. Not feel good. Look good. To who. For how long. Was it worth it. It wasn't. ಠ_ಠ`,
                `For the flex × ${tag[1]}. You are not building wealth you are building an aesthetic and it is expensive and it is not working. 😵‍💫`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'Never again') {
        return {
            tier1: [
                `🚫 Said never again ${tag[1]} time(s). And yet here you are. Logging. Still using the app.`,
                `${tag[1]} never again(s) this month. The commitment is noted. The follow-through is pending.`,
                `Never Again × ${tag[1]}. Strong words. Let's see if next month agrees.`
            ],
            tier2: [
                `🚫 ${tag[1]} things you swore off this month. You know what's coming next month right. More of the same. ¯\\_(ツ)_/¯`,
                `Said never again ${tag[1]} times. Each time felt real didn't it. Each time was a lie. ￣へ￣`,
                `${tag[1]} never again tags. You are very good at having regrets and very bad at acting on them. (⊙_⊙)`
            ],
            tier3: [
                `🚫 NEVER AGAIN × ${tag[1]}. That phrase has lost all meaning for you hasn't it. It's just a tag now. A ritual. A lie you tell yourself on a budget app. 💀`,
                `${tag[1]} times you said never again this month. I want you to sit with that number. ${tag[1]}. And then tell me you believe yourself. ಠ▃ಠ`,
                `Never again ${tag[1]} times. Next month you will be back. Same tags. Same number. Different items. Same you. 😵‍💫`
            ],
            times: tag[1]
        }
    } else if (cleanTags === 'Stupid but fun') {
        return {
            tier1: [
                `🤡 ${tag[1]} stupid-but-fun purchase(s). Honestly? Fair. Life is short. Just not that short.`,
                `Bought ${tag[1]} dumb thing(s) and enjoyed it. Respect. Minimal but present.`,
                `Stupid but fun × ${tag[1]}. The fun better have been proportional to the stupid.`
            ],
            tier2: [
                `🤡 ${tag[1]} stupid-but-fun purchases. At what point does it stop being fun and start just being stupid. We're getting close. ¯\\_(ツ)_/¯`,
                `${tag[1]} purchases that you knew were dumb going in. You did them anyway. For fun. ${tag[1]} times. The fun is getting expensive.`,
                `Stupid but fun × ${tag[1]}. The stupid is consistent. Jury's still out on the fun. ￣へ￣`
            ],
            tier3: [
                `🤡 ${tag[1]} STUPID BUT FUN PURCHASES. At this quantity it's just stupid with a fun origin story. The fun left around purchase 4. 💀`,
                `${tag[1]} times you chose chaos this month. On purpose. With money. And called it fun. Your savings account is not having fun. ಠ_ಠ`,
                `Stupid but fun × ${tag[1]}. You have optimised for the stupid and completely lost the fun. This is a cry for help wrapped in a purchase log. 😵‍💫`
            ],
            times: tag[1]
        }
    };
};

export function getRoastByTags(preff) {
    const redFlagRoast = [];
    for (let i = 0; i < preff.top4Tags.length; i++) {
        const tag = preff.top4Tags[i];
        if (tag[1] < 2) {
            continue;
        };
        let cleanTags = tag[0].replace(/(\p{Extended_Pictographic}|\p{Emoji_Component})/gu, '').trim();
        if (redFlagTags.includes(cleanTags)) {
            redFlagRoast.push(makeTagRoasts(cleanTags, tag));
        };
    };
    return redFlagRoast;
};

export function monthlyRoast(data, preff, isBad, selector) {
    let roast = '';
    const top4Tags = preff.top4Tags.map(tag => tag[0]);
    data.top4Data.forEach(categoryData => {
        let cleanData = categoryData[0].replace(/(\p{Extended_Pictographic}|\p{Emoji_Component})/gu, '').trim();
        if (redFlagCategory.includes(cleanData) || isBad) {
            roast = `<div>Well. Lets talk... you really enjoy spending on things that dont really matter huh.</div>`;
        };
    });
    if ((preff.preffCategory.key === 'Restaurants & Takeout 🍕' || preff.preffCategory.key === 'Coffee & Snacks ☕')
        && (top4Tags.includes('❗ Unplanned') ||
            top4Tags.includes('😈 YOLO') ||
            top4Tags.includes('👀 Peer pressure'))) {
        roast += `<div class = 'roast-category'>${preff.preffCategory.value} times eating out this month 🍕💸 Your kitchen isn't broken. You're just lazy and you paid to prove it.
        Tagged '${top4Tags[0]}' too. Unreal. Absolutely unreal. 😒
        </div>`;
    }
    else if ((preff.preffCategory.key === 'Subscriptions 📺' || preff.preffCategory.key === 'Entertainment 🎮')
        && preff.preffPaymentMode === 'Online' && (
            top4Tags.includes('🤦‍♂️ Regret') ||
            top4Tags.includes('😈 YOLO') ||
            top4Tags.includes('⚡ Impulse'))) {

        roast += `<div class='roast-category'>Transactions on online things? Somewhere a loading bar is spinning and it's your savings. 🫠</div>`;
    }
    else if ((preff.preffCategory.key === 'Fitness & Wellness 💪' || preff.preffCategory.key === 'Personal Care 💇‍♀️')
        && (top4Tags.includes("📸 For the flex") ||
            top4Tags.includes("💅 Treat myself") ||
            top4Tags.includes("⚡ Impulse"))) {

        roast += `<div class='roast-category'>${preff.preffCategory.value}x Fitness & Wellness purchases 💪📸 The subscription is active. The body is not. You're paying for the idea of going to the gym and the gym appreciates your donation.
        Who are you flexing on?. 💅</div>`;
    }
    else if (preff.preffCategory.key === 'Hobbies 🎨'
        && (data.category.moneySpent['Hobbies 🎨'] / data.totalAmt) * 100 >= 50) {

        roast += `<div class='roast-category'>${((data.category.moneySpent['Hobbies 🎨'] / data.totalAmt) * 100).toFixed(1)}% of your month went to hobbies 🎨🔥
         That's not a hobby that's a lifestyle you can't afford. Passion is free. Apparently yours isn't. 😵‍💫</div>`;
    }
    else if (preff.preffCategory.key === 'Gifts 🎁'
        && ((data.category.moneySpent['Gifts 🎁'] / data.totalAmt) * 100) >= 50) {

        roast += `<div class='roast-category'>${((data.category.moneySpent['Gifts 🎁'] / data.totalAmt) * 100).toFixed(1)}% spent on other people 🎁😭 
        You are literally funding everyone else's happiness while your bank account suffers alone in silence. MrBeast has sponsors. What's your excuse. 💀</div>`;
    } else {

        roast += `<div class='roast-category'>₹${data.totalAmt} gone across ${Object.keys(data.category.moneySpent).length} categories this month 📊🫠 No single catastrophe.
        Just vibes and poor decisions spread evenly like butter on burnt toast. Consistent. Impressively consistent. 👏</div>`;
    };
    selector.innerHTML = roast;
    return roast;
};
function randomNumGen(min, max) {
    return Math.floor(Math.random() * max) + min;
}
export function getAddPageRoasts(logData) {
    if (categoryLimits[logData.category]) {
        const category = logData.category;
        const categoryUsing = categoryLimits[category];
        const roasts = makeRoastsForAdding(logData);
        if (logData.amount > categoryUsing.max) {
            return `<div class="roast-on-add">${roasts.tier3[randomNumGen(0, roasts.tier3.length)]}</div>`;
        } else if (logData.amount < categoryUsing.min) {
            return `<div class="roast-on-add">${roasts.tier1[randomNumGen(0, roasts.tier1.length)]}</div>`;
        } else {
            return `<div class="roast-on-add">${roasts.tier2[randomNumGen(0, roasts.tier2.length)]}</div>`;
        };
    } else {
        return `<div class="roast-on-add"> OK noted as well...</div>`;
    };
};