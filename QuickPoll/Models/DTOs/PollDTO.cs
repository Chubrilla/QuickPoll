namespace QuickPoll.Models.DTOs
{
    public class PollDTO
    {
        public Guid Id { get; set; }
        public string Question { get; set; }
        public List<OptionDTO> Options { get; set; }
    }
    public class OptionDTO
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public int Votes { get; set; }
    }
}
