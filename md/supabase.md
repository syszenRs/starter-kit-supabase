### Some helpers for supabase things

- If you want to use `supabase cmd` instead of `npm/npx supabase cmd` you need to go [here](https://github.com/supabase/cli/releases) and download the latest cli release and put it in a folder and use in the path (for windows), if you put it in system32 folder you dont need to include in path

- to update just do `supabase stop` and then `supabase start`

- if need to update some version related to supabase images, just go to `project/supabase/temp` search for the file and change the version. If you found some errors like "The data directory was initialized by PostgreSQL version 15, which is not compatible with this version 17.0" you could need to delete the volumes from the docker.
  if don't resolve, delete temp folder and run `supabase start` again
