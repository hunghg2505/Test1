import { useEffect } from "react";
import { Box, Button, Grid, TextField, Typography, alpha } from "@mui/material";
import { styled } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useForm, Controller, FieldError } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { SearchActivityLogInput } from "../../model/activityLog";

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.customColor.blue.accent1,
  "&:hover": {
    backgroundColor: alpha(theme.palette.customColor.blue.accent1, 0.7),
  },
}));

const ResetButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.customColor.grey.main,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.customColor.grey.main, 0.5),
  },
}));

type FormValues = {
  profileId: string;
  startDate: string;
  endDate: string;
  limit: number;
  nextToken: string;
};

type SearchProps = {
  profileId?: string | null;
  onClickSearch: (data: SearchActivityLogInput) => void;
};

const SearchActivityLog = ({ profileId, onClickSearch }: SearchProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const defaultSearchValue = {
    profileId: profileId == "" ? searchParams.get("id") || "" : profileId || "",
    startDate: dayjs().subtract(7, "day").format(),
    endDate: dayjs().format(),
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  useEffect(() => {
    if (dayjs(watchStartDate) > dayjs(getValues("endDate"))) {
      setValue("endDate", dayjs(watchStartDate).format());
    }
  }, [watchStartDate, getValues, setValue]);

  useEffect(() => {
    if (dayjs(watchEndDate) < dayjs(getValues("startDate"))) {
      setValue("startDate", dayjs(watchEndDate).format());
    }
  }, [watchEndDate, getValues, setValue]);

  const handleOnClickSearch = (data: FormValues) => {
    if (!dayjs(data.startDate).isValid() || !dayjs(data.endDate).isValid()) {
      return;
    }
    onClickSearch({
      ...data,
      startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(data.endDate).format('YYYY-MM-DD'),
    });
  };

  const handleClearInputValue = () => {
    setValue("profileId", defaultSearchValue.profileId);
    setValue("startDate", defaultSearchValue.startDate);
    setValue("endDate", defaultSearchValue.endDate);
  };

  const getDateFieldError = (dateError: boolean, requiredError?: FieldError) => {
    if (dateError) {
      return t("Invalid date");
    } else if (requiredError) {
      return t("Required fields must be filled in.");
    }
    return "";
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Grid container>
          <Grid item xs={12} md={3} lg={3} sx={{ pr: "16px" }}>
            <Box>
              <Typography variant="body2" sx={{ mb: "8px" }}>
                {t("ABC ID")}
              </Typography>
              <TextField
                id="txt_profileId"
                defaultValue={defaultSearchValue.profileId}
                {...register("profileId", { required: true })}
                error={!!errors?.profileId}
                helperText={errors?.profileId ? t("Required fields must be filled in.") : ""}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={3} lg={3} sx={{ pr: "16px" }}>
            <Box>
              <Typography variant="body2" sx={{ mb: "8px" }}>
                {t("Start date")}
              </Typography>
              <Controller
                name="startDate"
                control={control}
                defaultValue={defaultSearchValue.startDate}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        inputFormat="DD/MM/YYYY"
                        renderInput={(params: any) => {
                          return (
                            <TextField
                              {...params}
                              id="txt_startDate"
                              fullWidth
                              error={params.error || !!errors?.startDate}
                              helperText={getDateFieldError(params.error, errors?.startDate)}
                            />
                          );
                        }}
                      />
                    </LocalizationProvider>
                  );
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={3} lg={3} sx={{ pr: "16px" }}>
            <Box>
              <Typography variant="body2" sx={{ mb: "8px" }}>
                {t("End date")}
              </Typography>
              <Controller
                name="endDate"
                control={control}
                defaultValue={defaultSearchValue.endDate}
                rules={{ required: true }}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      inputFormat="DD/MM/YYYY"
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          id="txt_endDate"
                          fullWidth
                          error={params.error || !!errors?.endDate}
                          helperText={getDateFieldError(params.error, errors?.endDate)}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", height: "100%" }} mt={{ xs: "16px", md: "38px" }}>
              <Box sx={{ mr: "16px" }}>
                <SearchButton id="btn_searchButton" variant="contained" onClick={handleSubmit(handleOnClickSearch)}>
                  <Typography variant="button">{t("SEARCH")}</Typography>
                </SearchButton>
              </Box>
              <Box>
                <ResetButton id="btn_resetButton" variant="contained" onClick={handleClearInputValue}>
                  <Typography variant="button">{t("RESET")}</Typography>
                </ResetButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SearchActivityLog;
