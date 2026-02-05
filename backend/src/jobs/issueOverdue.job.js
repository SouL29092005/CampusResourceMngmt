import cron from "node-cron";
import Issue from "../modules/library/issue.model.js";
import Book from "../modules/library/book.model.js";

export const startIssueOverdueJob = () => {
  cron.schedule("10 * * * * *", async () => {
    const now = new Date();

    try {
      const overdueIssues = await Issue.find({
        status: "ISSUED",
        dueAt: { $lt: now }
      });

      for (const issue of overdueIssues) {
        issue.status = "OVERDUE";
        await issue.save();
      }
    } catch (err) {
      console.error("Issue overdue job error:", err.message);
    }
  });
};