import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../model/walletUserList";
import { SearchType } from "../../enums/Search";

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

type SearchProps = {
  errorMessage?: string;
  onClickSearch: (data: SearchInput) => void;
  onClickReset: () => void;
};

const Search = ({ errorMessage, onClickSearch, onClickReset }: SearchProps) => {
  const { t } = useTranslation();
  const defaultSearchValue = "";
  const defaultSearchType = SearchType.MOBILE_NUMBER;
  const [searchValue, setSearchValue] = useState<string>(defaultSearchValue);
  const [searchType, setSearchType] = useState<string>(defaultSearchType);
  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(event.target.value);
  };

  const handleOnClickSearch = () => {
    onClickSearch({ searchValue, searchType });
  };

  const handleClearInputValue = () => {
    setSearchValue(defaultSearchValue);
    setSearchType(defaultSearchType);
    onClickReset();
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Grid container>
          <Grid item xs={12} md={6} lg={4} sx={{ pr: "16px" }}>
            <TextField
              id="txt_searchValue"
              error={!!errorMessage}
              helperText={errorMessage}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchValue}
              onChange={(event) => handleOnChange(event, setSearchValue)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{ display: "flex", height: "100%" }}
              mt={{ xs: "16px", md: "10px" }}
            >
              <Box sx={{ mr: "16px" }}>
                <SearchButton
                  id="btn_searchButton"
                  variant="contained"
                  onClick={handleOnClickSearch}
                >
                  <Typography variant="button">{t("SEARCH")}</Typography>
                </SearchButton>
              </Box>
              <Box>
                <ResetButton
                  id="btn_resetButton"
                  variant="contained"
                  onClick={handleClearInputValue}
                >
                  <Typography variant="button">{t("RESET")}</Typography>
                </ResetButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: "16px" }}>
        <FormControl>
          <RadioGroup
            id="radio_search_type_group"
            row
            value={searchType}
            aria-labelledby="search-type-radio-buttons-group-label"
            name="search-type-radio-buttons-group"
            onChange={(event) => handleOnChange(event, setSearchType)}
          >
            <FormControlLabel
              id="radio_search_type_mobileNumber"
              value={SearchType.MOBILE_NUMBER}
              control={<Radio />}
              label={t("Mobile No.")}
            />
            <FormControlLabel
              id="radio_search_type_thaiId"
              value={SearchType.THAI_ID}
              control={<Radio />}
              label={t("Thai ID")}
            />
            <FormControlLabel
              id="radio_search_type_passportNo"
              value={SearchType.PASSPORT_NO}
              control={<Radio />}
              label={t("Passport No.")}
            />
            <FormControlLabel
              id="radio_search_type_tmwId"
              value={SearchType.TMW_ID}
              control={<Radio />}
              label={t("TMN ID")}
            />
            <FormControlLabel
              id="radio_search_type_profielId"
              value={SearchType.ABC_PROFILE_ID}
              control={<Radio />}
              label={t("ABC ID")}
            />
            <FormControlLabel
              id="radio_search_type_abcChainAccount"
              value={SearchType.ABC_CHAIN_ACCOUNT}
              control={<Radio />}
              label={t("ABC Wallet Address")}
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  );
};

export default Search;
