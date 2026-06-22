function ProfileAndCapacitiesSection() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Edit Profile
      </h2>

      <div className="flex items-center justify-center p-2">
        <button
          type="submit"
          className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProfileAndCapacitiesSection;
