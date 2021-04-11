const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile');

module.exports = {
  create(req, res) {
    return res.render("job");
  },
  async save(req, res) {
  
    await Job.create({
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    });

    return res.redirect("/");
  },
  async show(req, res) {
    const jobsGet = await Job.get();
    const profileGet = await Profile.get();
    const jobId = req.params.id;

    const job = jobsGet.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    job.budget = JobUtils.calculateBudget(job, profileGet["value-hour"]);

    return res.render("job-edit", { job });
  },
  async update(req, res) {
    const jobId = req.params.id;

    const updateJob = {
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
    };

    await Job.update(updateJob, jobId);

    return res.redirect("/job/" + jobId);
  },
  async delete(req, res) {
    const jobId = req.params.id;
    await Job.delete(jobId);
    
    return res.redirect("/");
  },
};
