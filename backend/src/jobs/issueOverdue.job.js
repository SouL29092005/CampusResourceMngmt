import cron from "node-cron";
import Issue from "../modules/library/issue.model.js";
import Book from "../modules/library/book.model.js";

export const startIssueOverdueJob = () => {
  // run every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      // Find issued issues that are past due
      const overdueIssues = await Issue.find({
        status: "ISSUED",
        dueAt: { $lt: now }
      });

      for (const issue of overdueIssues) {
        issue.status = "OVERDUE";
        await issue.save();

        // Leave book.status as ISSUED (don't set to OVERDUE since Book.status enum doesn't include it)
      }
    } catch (err) {
      console.error("Issue overdue job error:", err.message);
    }
  });
};