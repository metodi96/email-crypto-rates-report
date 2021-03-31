const calculateRemainingTime = (cronJob) => {
    const timeUntilNextRunSeconds = cronJob.nextDates(1)[0].unix() - new Date().getTime() / 1000;
    const roundedTime = Math.round(timeUntilNextRunSeconds)
    if (roundedTime % 60 === 0) {
        console.log("Time until next run (min) for cronjob one: ", roundedTime / 60);
    }
}

module.exports = calculateRemainingTime