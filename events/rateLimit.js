module.exports = {
    func: (client, sql, Discord) => {
        client.bot.on("rateLimit", rateLimitInfo => {
            try {
                console.log(rateLimitInfo);
            } catch(e) {
                console.log(e);
            }
        });
    }
}