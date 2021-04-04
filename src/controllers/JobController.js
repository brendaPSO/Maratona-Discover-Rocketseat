const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile');

module.exports = {
  create(req, res) {
    return res.render("job");
  },
  save(req, res) {
    const jobsGet = Job.get();
    const lastID = jobsGet[jobsGet.length - 1]?.id || 0;

    jobsGet.push({
      id: lastID + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    });

    return res.redirect("/");
  },
  show(req, res) {
    const jobsGet = Job.get();
    const profileGet = Profile.get();
    const jobId = req.params.id;

    const job = jobsGet.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    job.budget = JobUtils.calculateBudget(job, profileGet["value-hour"]);

    return res.render("job-edit", { job });
  },
  update(req, res) {
    const jobsGet = Job.get();
    const jobId = req.params.id;

    const job = jobsGet.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const updateJob = {
      ...job,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
    };

    const newJobs = jobsGet.map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updateJob;
      }

      return job;
    });

    Job.update(newJobs);

    return res.redirect("/job/" + jobId);
  },
  delete(req, res) {
    const jobId = req.params.id;
    Job.delete(jobId);
    
    return res.redirect("/");
  },
};
