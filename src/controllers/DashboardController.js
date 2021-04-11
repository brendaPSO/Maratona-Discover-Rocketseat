const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  async index(req, res) {
    const jobsGet = await Job.get();
    const profileGet = await Profile.get();

    const statusCount = {
      progress: 0,
      done: 0,
      total: jobsGet.length,
    }

    let jobTotalHours = 0;

    const updatedJobs = jobsGet.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      statusCount[status] += 1;

      jobTotalHours = status == "progress" ? 
      jobTotalHours + Number(job['daily-hours']) : 
      jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profileGet["value-hour"]),
      };
    });

    freeHours = profileGet["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile: profileGet,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
