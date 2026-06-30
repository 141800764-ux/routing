import { getTags } from "@/lib/actions/tag.action";

const Tags = async () => {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 3,
    query: "",
    filter: "",
  });

  if (!success) {
    return <div>{error || "Failed to load tags"}</div>;
  }

  const { tags } = data || { tags: [] };

  console.log("TAGS:", tags);

  console.log("TAGS", JSON.stringify(tags, null, 2));

  return (
    <div>
      <h1 className="h1-bold mb-6">Tags</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tags?.map((tag: any) => (
          <div
            key={tag._id}
            className="rounded-2xl border border-gray-800 bg-dark-200 p-6"
          >
            <h2 className="h3-bold mb-3">{tag.name}</h2>

            <p className="text-light-500 mb-4">
              {tag.description || "No description available"}
            </p>

            <div className="text-orange-500 font-semibold">
              {tag.questions?.length || 0} Questions
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;