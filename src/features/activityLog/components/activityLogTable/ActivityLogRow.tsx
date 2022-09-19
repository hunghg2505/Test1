import { useState } from "react";
import { TableCell, TableRow, Box, Typography, Collapse, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ActivityLogTableType } from "./ActivityLogTable";

const ActivityLogRow = ({ row }: { row: ActivityLogTableType }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={row.dateTime}
        id={`tbl_row_${row.dateTime}`}
        hover
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell>{row.dateTime}</TableCell>
        <TableCell>{row.track}</TableCell>
        <TableCell>{row.logCategory}</TableCell>
        <TableCell>{row.logName}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>
          <Typography
            id={`btn_moreInfo_${row.dateTime}`}
            variant="body2"
            component="span"
            onClick={() => setOpen(!open)}
            sx={{
              color: "customColor.blue.accent2",
              cursor: "pointer",
            }}
          >
            {t("More info")}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {
              row.meta && row.meta.map(item => (
                <Box key={item?.key} sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}>
                  <Grid container>
                    <Grid item xs={3} sx={{ p: "16px", bgcolor: "customColor.grey.accent4" }}>
                      <Box>
                        <Typography variant="body1">{item?.key}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ p: "16px" }}>
                      <Box>
                        <Typography variant="body1">{item?.value}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))
            }
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ActivityLogRow;
