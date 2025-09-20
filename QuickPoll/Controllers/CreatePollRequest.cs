namespace QuickPoll.Controllers
{
    public partial class PollsController
    {
        public class CreatePollRequest
        {
            public string Question { get; set; }
            public List<string> Options { get; set; }
        }
    }
}