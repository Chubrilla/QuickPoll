namespace QuickPoll.Models
{
    public class Poll
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Question { get; set; }
        public List<Option> Options { get; set; } = new();
    }

    public class Option
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Text { get; set; }
        public int Votes { get; set; }
        public Guid PollId { get; set; }
        public Poll Poll { get; set; }
    }
}
